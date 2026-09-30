import { getCollection, saveCollection, logAudit } from '../db.js';

const sanitizeProduct = (p) => {
  let img = p.image;
  if (!img || img.startsWith('blob:')) {
    if (p.gallery && p.gallery.length > 0 && !p.gallery[0].startsWith('blob:')) {
      img = p.gallery[0];
    } else if (p.images && p.images.length > 0) {
      img = p.images[0];
    } else {
      img = '/images/products/pneumatic-cylinders/iso-15552-main.jpg';
    }
  }

  const cleanGallery = (p.gallery && p.gallery.length > 0)
    ? p.gallery.filter(g => !g.startsWith('blob:'))
    : (p.images || [img]);

  return {
    ...p,
    image: img,
    images: cleanGallery.length > 0 ? cleanGallery : [img],
    gallery: cleanGallery.length > 0 ? cleanGallery : [img],
    priceUSD: p.priceUSD || 150,
    priceINR: p.priceINR || 12500,
    minOrderQty: p.minOrderQty || 1,
    standardLeadTimeDays: p.standardLeadTimeDays || 7,
    status: p.status || 'Active'
  };
};

export const handleProducts = async (req, res, method, pathParts, body, query) => {
  const id = pathParts[2]; // /api/products or /api/products/:id or /api/products/bulk
  let products = getCollection('products');

  if (method === 'GET') {
    if (id && id !== 'bulk') {
      const product = products.find(p => p.id === id || p.slug === id);
      if (product) {
        return { statusCode: 200, body: { success: true, data: sanitizeProduct(product) } };
      }
      return { statusCode: 404, body: { success: false, message: 'Product not found' } };
    }

    // List with search & category filter
    let results = products.map(sanitizeProduct);
    if (query.category) {
      results = results.filter(p => (p.category || '').toLowerCase() === query.category.toLowerCase() || p.categoryId === query.category);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(p => 
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.sku && p.sku.toLowerCase().includes(s))
      );
    }
    if (query.featured) {
      results = results.filter(p => p.featured === true || p.featured === 'true');
    }

    return { statusCode: 200, body: { success: true, data: results, count: results.length } };
  }

  if (method === 'POST') {
    if (id === 'bulk') {
      const newItems = Array.isArray(body?.products) ? body.products : (Array.isArray(body) ? body : []);
      const created = newItems.map(item => sanitizeProduct({
        id: item.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
        createdAt: new Date().toISOString(),
        ...item
      }));
      products = [...products, ...created];
      saveCollection('products', products);
      logAudit('Bulk Import Products', 'Admin', `Imported ${created.length} products.`);
      return { statusCode: 201, body: { success: true, count: created.length, data: created } };
    }

    // Create single product
    const newProduct = sanitizeProduct({
      id: body.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
      name: body.name || 'Untitled Product',
      category: body.category || 'Pneumatic Components',
      categoryId: body.categoryId || '',
      sku: body.sku || ('WLD-' + Math.floor(1000 + Math.random() * 9000)),
      modelNumber: body.modelNumber || body.sku || '',
      brand: body.brand || 'WELDOR PRECISION',
      subCategory: body.subCategory || 'Standard Series',
      tagline: body.tagline || '',
      description: body.description || '',
      bulletPoints: body.bulletPoints || [
        'High-precision OEM component engineered for severe continuous duty.',
        '100% factory pressure tested with material test certificate.'
      ],
      industries: body.industries || ['Automotive', 'Aerospace'],
      applications: body.applications || ['Automation Cell'],
      materials: body.materials || ['SS304', 'Aluminum Alloy'],
      image: body.image || (body.gallery?.[0]) || '/images/products/pneumatic-cylinders/iso-15552-main.jpg',
      gallery: body.gallery || [body.image || '/images/products/pneumatic-cylinders/iso-15552-main.jpg'],
      cadFile: body.cadFile || '/catalog/Weldor_Welding_Product_Catalog.pdf',
      catalogPdfUrl: body.catalogPdfUrl || '/catalog/Weldor_Welding_Product_Catalog.pdf',
      priceUSD: body.priceUSD || 150,
      priceINR: body.priceINR || 12500,
      minOrderQty: body.minOrderQty || 1,
      standardLeadTimeDays: body.standardLeadTimeDays || 7,
      featured: Boolean(body.featured),
      inStock: body.inStock !== false,
      status: body.status || 'Active',
      createdAt: new Date().toISOString()
    });

    products.unshift(newProduct);
    saveCollection('products', products);
    logAudit('Create Product', 'Admin', `Created product: ${newProduct.name}`);
    return { statusCode: 201, body: { success: true, data: newProduct } };
  }

  if (method === 'PUT' && id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return { statusCode: 404, body: { success: false, message: 'Product not found' } };
    }
    products[index] = sanitizeProduct({ ...products[index], ...body, updatedAt: new Date().toISOString() });
    saveCollection('products', products);
    logAudit('Update Product', 'Admin', `Updated product ID: ${id}`);
    return { statusCode: 200, body: { success: true, data: products[index] } };
  }

  if (method === 'DELETE' && id) {
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) {
      return { statusCode: 404, body: { success: false, message: 'Product not found' } };
    }
    saveCollection('products', filtered);
    logAudit('Delete Product', 'Admin', `Deleted product ID: ${id}`);
    return { statusCode: 200, body: { success: true, message: 'Product deleted successfully' } };
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};
