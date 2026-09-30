import { getCollection, saveCollection, logAudit } from '../db.js';

export const handleCategories = async (req, res, method, pathParts, body) => {
  const id = pathParts[2];
  let categories = getCollection('categories');

  if (method === 'GET') {
    if (id) {
      const cat = categories.find(c => c.id === id || c.slug === id);
      return cat 
        ? { statusCode: 200, body: { success: true, data: cat } }
        : { statusCode: 404, body: { success: false, message: 'Category not found' } };
    }
    return { statusCode: 200, body: { success: true, data: categories } };
  }

  if (method === 'POST') {
    const newCat = {
      id: body.id || ('cat_' + Date.now()),
      name: body.name || 'New Category',
      slug: body.slug || (body.name || '').toLowerCase().replace(/\s+/g, '-'),
      description: body.description || '',
      image: body.image || '/images/categories/pneumatic-cylinders.jpg',
      banner: body.banner || body.image || '/images/categories/pneumatic-cylinders.jpg',
      icon: body.icon || 'Box',
      featured: body.featured ?? true,
      createdAt: new Date().toISOString()
    };
    categories.push(newCat);
    saveCollection('categories', categories);
    logAudit('Create Category', 'Admin', `Created category: ${newCat.name}`);
    return { statusCode: 201, body: { success: true, data: newCat } };
  }

  if (method === 'PUT' && id) {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return { statusCode: 404, body: { success: false, message: 'Category not found' } };
    categories[index] = { ...categories[index], ...body, updatedAt: new Date().toISOString() };
    saveCollection('categories', categories);
    return { statusCode: 200, body: { success: true, data: categories[index] } };
  }

  if (method === 'DELETE' && id) {
    const filtered = categories.filter(c => c.id !== id);
    saveCollection('categories', filtered);
    return { statusCode: 200, body: { success: true, message: 'Category deleted' } };
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};

export const handleBanners = async (req, res, method, pathParts, body) => {
  const id = pathParts[2];
  let banners = getCollection('banners');

  if (method === 'GET') {
    return { statusCode: 200, body: { success: true, data: banners } };
  }

  if (method === 'POST') {
    if (id === 'reorder') {
      const orderList = Array.isArray(body?.banners) ? body.banners : (Array.isArray(body) ? body : []);
      saveCollection('banners', orderList);
      return { statusCode: 200, body: { success: true, message: 'Banners reordered', data: orderList } };
    }
    const newBanner = {
      id: body.id || ('ban_' + Date.now()),
      badge: body.badge || 'WELDOR INDUSTRIAL AUTOMATION',
      title: body.title || 'Precision Industrial Components',
      highlightText: body.highlightText || '',
      subtitle: body.subtitle || '',
      description: body.description || '',
      image: body.image || body.bgImageUrl || '/images/banners/hero-banner-welding-torches.jpg',
      bgImageUrl: body.bgImageUrl || body.image || '/images/banners/hero-banner-welding-torches.jpg',
      productImageUrl: body.productImageUrl || '/images/banners/overlay-torch-product.png',
      productSku: body.productSku || 'WLD-OEM-01',
      productName: body.productName || body.title || 'Precision Component',
      transitionEffect: body.transitionEffect || 'zoom',
      overlayTheme: body.overlayTheme || 'dark-glass',
      primaryBtnText: body.primaryBtnText || 'Explore Product Catalog',
      primaryBtnAction: body.primaryBtnAction || 'public-products',
      secondaryBtnText: body.secondaryBtnText || 'Download PDF Catalog',
      secondaryBtnAction: body.secondaryBtnAction || 'public-rfq',
      order: body.order || banners.length + 1,
      displayOrder: body.displayOrder || banners.length + 1,
      active: body.active ?? true,
      stats: body.stats || [{ label: "Export Quality", value: "100% Tested" }],
      features: body.features || ["100% Factory Pressure Tested", "Direct OEM Pricing"],
      link: body.link || '',
      createdAt: new Date().toISOString()
    };
    banners.push(newBanner);
    saveCollection('banners', banners);
    return { statusCode: 201, body: { success: true, data: newBanner } };
  }

  if (method === 'DELETE' && id) {
    const filtered = banners.filter(b => b.id !== id);
    saveCollection('banners', filtered);
    return { statusCode: 200, body: { success: true, message: 'Banner removed' } };
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};

export const handleGallery = async (req, res, method, pathParts, body) => {
  const id = pathParts[2];
  let gallery = getCollection('gallery');

  if (method === 'GET') {
    return { statusCode: 200, body: { success: true, data: gallery } };
  }

  if (method === 'POST') {
    if (id === 'bulk') {
      const newItems = Array.isArray(body?.items) ? body.items : (Array.isArray(body) ? body : []);
      const created = newItems.map(item => ({
        id: item.id || ('gal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        createdAt: new Date().toISOString(),
        ...item
      }));
      gallery = [...gallery, ...created];
      saveCollection('gallery', gallery);
      return { statusCode: 201, body: { success: true, data: created } };
    }
    const newItem = {
      id: body.id || ('gal_' + Date.now()),
      title: body.title || 'Workshop Manufacturing',
      image: body.image || '/images/gallery/cnc-5axis-machining-bay.jpg',
      url: body.url || body.image || '/images/gallery/cnc-5axis-machining-bay.jpg',
      thumbnail: body.thumbnail || body.image || '/images/gallery/cnc-5axis-machining-bay.jpg',
      category: body.category || 'General',
      caption: body.caption || '',
      tags: body.tags || ['Manufacturing', 'ISO 9001'],
      createdAt: new Date().toISOString()
    };
    gallery.push(newItem);
    saveCollection('gallery', gallery);
    return { statusCode: 201, body: { success: true, data: newItem } };
  }

  if (method === 'DELETE' && id) {
    const filtered = gallery.filter(g => g.id !== id);
    saveCollection('gallery', filtered);
    return { statusCode: 200, body: { success: true, message: 'Gallery item removed' } };
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};

export const handleExhibitions = async (req, res, method, pathParts, body, query) => {
  const sub = pathParts[2]; // /api/exhibitions or /api/exhibitions/slug/:slug or /api/exhibitions/:id
  let exhibitions = getCollection('exhibitions');

  if (method === 'GET') {
    if (sub === 'slug' && pathParts[3]) {
      const item = exhibitions.find(e => e.slug === pathParts[3]);
      return item 
        ? { statusCode: 200, body: { success: true, data: item } }
        : { statusCode: 404, body: { success: false, message: 'Exhibition not found' } };
    }
    if (sub && sub !== 'slug') {
      const item = exhibitions.find(e => e.id === sub);
      return item 
        ? { statusCode: 200, body: { success: true, data: item } }
        : { statusCode: 404, body: { success: false, message: 'Exhibition not found' } };
    }
    if (query.status) {
      const filtered = exhibitions.filter(e => (e.status || '').toLowerCase() === query.status.toLowerCase());
      return { statusCode: 200, body: { success: true, data: filtered } };
    }
    return { statusCode: 200, body: { success: true, data: exhibitions } };
  }

  if (method === 'POST') {
    const newExh = {
      id: body.id || ('exh_' + Date.now()),
      title: body.title || 'Exhibition Title',
      slug: body.slug || (body.title || '').toLowerCase().replace(/\s+/g, '-'),
      venue: body.venue || '',
      city: body.city || '',
      country: body.country || 'India',
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      stallNumber: body.stallNumber || '',
      status: body.status || 'Upcoming',
      description: body.description || '',
      bannerImage: body.bannerImage || body.image || '/images/exhibitions/imtex-bangalore-2026.jpg',
      image: body.image || body.bannerImage || '/images/exhibitions/imtex-bangalore-2026.jpg',
      gallery: body.gallery || [
        '/images/exhibitions/imtex-bangalore-2026.jpg',
        '/images/exhibitions/booth-showcase-1.jpg'
      ],
      createdAt: new Date().toISOString()
    };
    exhibitions.push(newExh);
    saveCollection('exhibitions', exhibitions);
    logAudit('Create Exhibition', 'Admin', `Added exhibition: ${newExh.title}`);
    return { statusCode: 201, body: { success: true, data: newExh } };
  }

  if (method === 'PUT' && sub) {
    const idx = exhibitions.findIndex(e => e.id === sub);
    if (idx === -1) return { statusCode: 404, body: { success: false, message: 'Exhibition not found' } };
    exhibitions[idx] = { ...exhibitions[idx], ...body, updatedAt: new Date().toISOString() };
    saveCollection('exhibitions', exhibitions);
    return { statusCode: 200, body: { success: true, data: exhibitions[idx] } };
  }

  if (method === 'DELETE' && sub) {
    const filtered = exhibitions.filter(e => e.id !== sub);
    saveCollection('exhibitions', filtered);
    return { statusCode: 200, body: { success: true, message: 'Exhibition deleted' } };
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};
