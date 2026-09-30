import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Box, 
  FileCode, 
  Video, 
  CheckCircle2, 
  X,
  Filter,
  Eye,
  Layers,
  FileText,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Key,
  ShieldCheck,
  Download,
  Play,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Star,
  FileSpreadsheet,
  UploadCloud,
  Check,
  AlertCircle
} from 'lucide-react';
import type { Product, ProductSpecification } from '../../types';

export const ProductCatalogManager: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, showNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
  const [mediaFilter, setMediaFilter] = useState<'All' | 'Has Video' | 'Has CAD' | 'Has Brochure'>('All');
  const [homeFeaturedFilter, setHomeFeaturedFilter] = useState<'All' | 'Featured on Home' | 'Catalog Only'>('All');

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkParsedProducts, setBulkParsedProducts] = useState<Partial<Product>[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'vital' | 'bullets' | 'media' | 'specs' | 'pricing' | 'seo'>('vital');

  // Form State (Amazon-Style Listing Fields)
  const [formData, setFormData] = useState<{
    name: string;
    sku: string;
    modelNumber: string;
    brand: string;
    category: string;
    subCategory: string;
    tagline: string;
    description: string;
    bulletPoints: string[];
    industries: string[];
    applications: string[];
    materials: string[];
    image: string;
    gallery: string[];
    videoUrl: string;
    videoThumbnail: string;
    catalogPdfUrl: string;
    datasheetUrl: string;
    cadDrawingUrl: string;
    priceUSD: number;
    priceINR: number;
    minOrderQty: number;
    standardLeadTimeDays: number;
    inStock: boolean;
    featured: boolean;
    status: 'Active' | 'Draft' | 'Archived';
    certifications: string[];
    specifications: ProductSpecification[];
    seoKeywords: string[];
    seoMetaTitle: string;
    seoMetaDescription: string;
  }>({
    name: '',
    sku: '',
    modelNumber: '',
    brand: 'WELDOR PRECISION',
    category: categories[0]?.name || 'Pneumatic Components',
    subCategory: '',
    tagline: '',
    description: '',
    bulletPoints: [
      'Engineered to precision industrial tolerances for maximum cycle endurance.',
      'High-grade anti-corrosion surface finish for harsh operating environments.',
      '100% factory pressure hold and dimensional CMM inspection certified.',
      'Universal ISO standard mounting interface for seamless OEM replacement.',
      'Complete MTC 3.1 material test certificate included with dispatch.'
    ],
    industries: ['Automotive', 'Automation & Robotics', 'Heavy Engineering'],
    applications: ['Robotic Fixture', 'Hydraulic Press', 'Assembly Line'],
    materials: ['Hard Anodized Aluminum', 'SS304 Piston Rod', 'Viton Seals'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnail: '',
    catalogPdfUrl: 'https://weldorindustries.com/catalogs/Weldor-Product-Catalog.pdf',
    datasheetUrl: '',
    cadDrawingUrl: 'https://weldorindustries.com/drawings/Weldor-3D-CAD.step',
    priceUSD: 150,
    priceINR: 12500,
    minOrderQty: 5,
    standardLeadTimeDays: 7,
    inStock: true,
    featured: true,
    status: 'Active',
    certifications: ['ISO 9001:2015', 'CE Certified'],
    specifications: [
      { label: 'Max Operating Pressure', value: '10 Bar' },
      { label: 'Operating Temperature', value: '-20°C to +80°C' },
      { label: 'Bore Size Range', value: '32 mm – 320 mm' },
      { label: 'Leakage Testing', value: '100% Nitrogen Bubble Tested' }
    ],
    seoKeywords: ['pneumatic cylinder', 'iso 15552 air actuator', 'heavy industrial valve', 'double acting ram'],
    seoMetaTitle: '',
    seoMetaDescription: ''
  });

  // Temporary inputs for array tags
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [newIndustryInput, setNewIndustryInput] = useState('');
  const [newApplicationInput, setNewApplicationInput] = useState('');
  const [newMaterialInput, setNewMaterialInput] = useState('');

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) ||
      (p.modelNumber && p.modelNumber.toLowerCase().includes(q)) ||
      (p.seoKeywords && p.seoKeywords.some(k => k.toLowerCase().includes(q)));
    
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    const matchesStatus = statusFilter === 'All' || (p.status || 'Active') === statusFilter;
    
    let matchesMedia = true;
    if (mediaFilter === 'Has Video') matchesMedia = !!p.videoUrl;
    if (mediaFilter === 'Has CAD') matchesMedia = !!p.cadDrawingUrl;
    if (mediaFilter === 'Has Brochure') matchesMedia = !!p.catalogPdfUrl;

    let matchesHomeFeatured = true;
    if (homeFeaturedFilter === 'Featured on Home') matchesHomeFeatured = !!p.featured;
    if (homeFeaturedFilter === 'Catalog Only') matchesHomeFeatured = !p.featured;

    return matchesSearch && matchesCat && matchesStatus && matchesMedia && matchesHomeFeatured;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `WEL-${Date.now().toString().slice(-4)}`,
      modelNumber: '',
      brand: 'WELDOR PRECISION',
      category: categories[0]?.name || 'Pneumatic Components',
      subCategory: '',
      tagline: '',
      description: '',
      bulletPoints: [
        'Engineered to precision industrial tolerances for maximum cycle endurance.',
        'High-grade anti-corrosion surface finish for harsh operating environments.',
        '100% factory pressure hold and dimensional CMM inspection certified.',
        'Universal ISO standard mounting interface for seamless OEM replacement.',
        'Complete MTC 3.1 material test certificate included with dispatch.'
      ],
      industries: ['Automotive', 'Automation & Robotics', 'Heavy Engineering'],
      applications: ['Robotic Fixture', 'Hydraulic Press', 'Assembly Line'],
      materials: ['Hard Anodized Aluminum', 'SS304 Piston Rod', 'Viton Seals'],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      gallery: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800'
      ],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      videoThumbnail: '',
      catalogPdfUrl: 'https://weldorindustries.com/catalogs/Weldor-Product-Catalog.pdf',
      datasheetUrl: '',
      cadDrawingUrl: 'https://weldorindustries.com/drawings/Weldor-3D-CAD.step',
      priceUSD: 150,
      priceINR: 12500,
      minOrderQty: 5,
      standardLeadTimeDays: 7,
      inStock: true,
      featured: true,
      status: 'Active',
      certifications: ['ISO 9001:2015', 'CE Certified'],
      specifications: [
        { label: 'Max Operating Pressure', value: '10 Bar' },
        { label: 'Operating Temperature', value: '-20°C to +80°C' },
        { label: 'Bore Size Range', value: '32 mm – 320 mm' },
        { label: 'Leakage Testing', value: '100% Nitrogen Bubble Tested' }
      ],
      seoKeywords: ['pneumatic cylinder', 'iso 15552 air actuator', 'heavy industrial valve', 'double acting ram'],
      seoMetaTitle: '',
      seoMetaDescription: ''
    });
    setActiveFormTab('vital');
    setIsAddEditModalOpen(true);
  };

  const handleEditClick = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      modelNumber: prod.modelNumber || '',
      brand: prod.brand || 'WELDOR PRECISION',
      category: prod.category,
      subCategory: prod.subCategory || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      bulletPoints: prod.bulletPoints && prod.bulletPoints.length > 0 ? prod.bulletPoints : [
        'High-precision OEM component engineered for severe continuous duty.',
        '100% factory pressure tested with material test certificate.'
      ],
      industries: prod.industries || ['Automotive', 'Aerospace'],
      applications: prod.applications || ['Automation Cell'],
      materials: prod.materials || ['SS304', 'Aluminum Alloy'],
      image: prod.image,
      gallery: prod.gallery && prod.gallery.length > 0 ? prod.gallery : [prod.image],
      videoUrl: prod.videoUrl || '',
      videoThumbnail: prod.videoThumbnail || '',
      catalogPdfUrl: prod.catalogPdfUrl || '',
      datasheetUrl: prod.datasheetUrl || '',
      cadDrawingUrl: prod.cadDrawingUrl || '',
      priceUSD: prod.priceUSD || 150,
      priceINR: prod.priceINR || 12500,
      minOrderQty: prod.minOrderQty || 1,
      standardLeadTimeDays: prod.standardLeadTimeDays || 7,
      inStock: prod.inStock ?? true,
      featured: prod.featured ?? true,
      status: prod.status || 'Active',
      certifications: prod.certifications || ['ISO 9001:2015'],
      specifications: prod.specifications && prod.specifications.length > 0 ? prod.specifications : [
        { label: 'Operating Pressure', value: 'Standard Rating' }
      ],
      seoKeywords: prod.seoKeywords || [],
      seoMetaTitle: prod.seoMetaTitle || '',
      seoMetaDescription: prod.seoMetaDescription || ''
    });
    setActiveFormTab('vital');
    setIsAddEditModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      showNotification('Product Name & SKU are required vital fields!', 'warning');
      setActiveFormTab('vital');
      return;
    }

    const matchedCat = categories.find(c => c.name === formData.category);
    const categoryId = matchedCat?.id || 'cat-pneumatic';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        categoryId
      });
      showNotification(`Product "${formData.name}" updated successfully!`, 'success');
    } else {
      addProduct({
        ...formData,
        categoryId
      });
      showNotification(`New Amazon-Style Product Listing "${formData.name}" created!`, 'success');
    }

    setIsAddEditModalOpen(false);
  };

  // Helper for Spec table rows
  const handleAddSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const handleUpdateSpecRow = (index: number, field: 'label' | 'value' | 'unit', val: string) => {
    setFormData(prev => {
      const updated = [...prev.specifications];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, specifications: updated };
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Helper for Real File Upload (Cloudinary CDN / Server API with fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'image' | 'gallery' | 'videoUrl' | 'catalogPdfUrl' | 'cadDrawingUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    showNotification(`Uploading "${file.name}"...`, 'info');
    let uploadedUrl = '';
    try {
      const res = await api.uploadFile(file);
      if (res?.success && (res?.data?.cdnUrl || res?.data?.url)) {
        uploadedUrl = res.data.cdnUrl || res.data.url;
      }
    } catch (err) {
      console.warn('Upload error, fallback:', err);
    }
    const finalUrl = uploadedUrl || URL.createObjectURL(file);

    if (targetField === 'gallery') {
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, finalUrl] }));
      showNotification(`Added "${file.name}" to gallery!`, 'success');
    } else if (targetField === 'image') {
      setFormData(prev => ({ ...prev, image: finalUrl, gallery: prev.gallery.includes(finalUrl) ? prev.gallery : [finalUrl, ...prev.gallery] }));
      showNotification(`Thumbnail updated to "${file.name}"!`, 'success');
    } else {
      setFormData(prev => ({ ...prev, [targetField]: finalUrl }));
      showNotification(`Uploaded "${file.name}" successfully!`, 'success');
    }
  };

  // SEO Keyword Tag Adder
  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const clean = newKeywordInput.trim().toLowerCase();
    if (!formData.seoKeywords.includes(clean)) {
      setFormData(prev => ({ ...prev, seoKeywords: [...prev.seoKeywords, clean] }));
    }
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(k => k !== keyword) }));
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const headers = [
      'Name',
      'SKU',
      'ModelNumber',
      'Category',
      'SubCategory',
      'Tagline',
      'Description',
      'PriceUSD',
      'PriceINR',
      'MinOrderQty',
      'StandardLeadTimeDays',
      'InStock',
      'FeaturedOnHome',
      'PrimaryImageUrl',
      'BulletPoints',
      'Specifications',
      'SEOKeywords'
    ];

    const sampleRow1 = [
      '"ISO 15552 Heavy-Duty Pneumatic Cylinder"',
      '"WEL-PNC-63-200"',
      '"PNC-63-200"',
      '"Pneumatic Automation Components"',
      '"ISO 15552 Cylinders"',
      '"High-cycle double-acting cylinder with adjustable cushioning"',
      '"Engineered for harsh automation lines with 10M cycle endurance."',
      '85',
      '7100',
      '2',
      '3',
      'true',
      'true',
      '"https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"',
      '"ISO 15552 compliant; Magnetic sensor slots; Viton seals"',
      '"Bore:63mm|Stroke:200mm|Pressure:10Bar|Port:G3/8"',
      '"pneumatic cylinder; air actuator; iso 15552"'
    ];

    const sampleRow2 = [
      '"700 Bar High-Pressure Solenoid Valve"',
      '"WEL-HYV-700B"',
      '"HYV-700-SOL"',
      '"High-Pressure Hydraulic Systems"',
      '"Hydraulic Directional Valves"',
      '"Zero leakage poppet valve for 700 Bar hydraulic powerpacks"',
      '"Hardened tool steel poppets ground to optical flatness."',
      '290',
      '24200',
      '1',
      '5',
      'true',
      'true',
      '"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"',
      '"700 Bar continuous rating; CETOP 3 footprint; 24VDC coil"',
      '"Pressure:700Bar|Flow:25L/min|Mount:CETOP3"',
      '"hydraulic valve; 700 bar; high pressure solenoid"'
    ];

    const csvContent = [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'weldor_bulk_product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Sample Excel / CSV template downloaded!', 'success');
  };

  // Export Current Products to CSV
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'SKU',
      'ModelNumber',
      'Category',
      'SubCategory',
      'Tagline',
      'PriceUSD',
      'PriceINR',
      'MinOrderQty',
      'InStock',
      'FeaturedOnHome',
      'Status',
      'SEOKeywords'
    ];

    const rows = products.map(p => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.sku || ''}"`,
      `"${p.modelNumber || ''}"`,
      `"${p.category || ''}"`,
      `"${p.subCategory || ''}"`,
      `"${(p.tagline || '').replace(/"/g, '""')}"`,
      p.priceUSD || 0,
      p.priceINR || 0,
      p.minOrderQty || 1,
      p.inStock ? 'true' : 'false',
      p.featured ? 'true' : 'false',
      p.status || 'Active',
      `"${(p.seoKeywords || []).join('; ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `weldor_products_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Exported ${products.length} products to CSV!`, 'success');
  };

  // Handle CSV file selection and parsing
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFileName(file.name);
    setBulkError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File is empty.');

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) throw new Error('File must contain a header row and at least 1 product row.');

        // CSV Parser supporting quotes
        const parseCSVLine = (line: string) => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const parsed: Partial<Product>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if (!cols[0] || !cols[1]) continue;

          // Parse specs
          const specsRaw = cols[15] || '';
          const specsList: ProductSpecification[] = specsRaw.split('|').filter(Boolean).map(item => {
            const [label, val] = item.split(':');
            return { label: (label || 'Spec').trim(), value: (val || '').trim() };
          });

          // Parse bullets
          const bulletsRaw = cols[14] || '';
          const bulletsList = bulletsRaw.split(';').map(b => b.trim()).filter(Boolean);

          // Parse SEO keywords
          const keywordsRaw = cols[16] || '';
          const keywordsList = keywordsRaw.split(';').map(k => k.trim()).filter(Boolean);

          const matchedCat = categories.find(c => c.name.toLowerCase() === (cols[3] || '').toLowerCase()) || categories[0];

          parsed.push({
            name: cols[0].replace(/^"|"$/g, ''),
            sku: cols[1].replace(/^"|"$/g, ''),
            modelNumber: (cols[2] || '').replace(/^"|"$/g, ''),
            category: cols[3] || matchedCat?.name || 'Pneumatic Automation Components',
            categoryId: matchedCat?.id || 'cat-pnc-01',
            subCategory: cols[4] || 'Standard Series',
            tagline: (cols[5] || cols[0]).replace(/^"|"$/g, ''),
            description: (cols[6] || cols[0]).replace(/^"|"$/g, ''),
            priceUSD: Number(cols[7]) || 100,
            priceINR: Number(cols[8]) || 8000,
            minOrderQty: Number(cols[9]) || 1,
            standardLeadTimeDays: Number(cols[10]) || 5,
            inStock: cols[11]?.toLowerCase() === 'true' || cols[11] === '1',
            featured: cols[12]?.toLowerCase() === 'true' || cols[12] === '1',
            image: cols[13]?.replace(/^"|"$/g, '') || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
            gallery: [cols[13]?.replace(/^"|"$/g, '') || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'],
            bulletPoints: bulletsList.length > 0 ? bulletsList : ['Precision industrial grade component.', 'Tested and certified.'],
            specifications: specsList.length > 0 ? specsList : [{ label: 'Standard Rating', value: 'Industrial ISO' }],
            seoKeywords: keywordsList.length > 0 ? keywordsList : ['industrial', 'precision component'],
            status: 'Active',
            certifications: ['ISO 9001:2015', 'CE Mark']
          });
        }

        if (parsed.length === 0) throw new Error('No valid product rows could be extracted. Please check the CSV format.');

        setBulkParsedProducts(parsed);
      } catch (err: any) {
        setBulkError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCommitBulkImport = async () => {
    if (bulkParsedProducts.length === 0) return;
    setIsImporting(true);
    try {
      // 1. Persist to server backend database (server/data/products.json)
      await api.bulkCreateProducts(bulkParsedProducts);

      // 2. Update local state
      for (const p of bulkParsedProducts) {
        addProduct(p as any);
      }

      showNotification(`Successfully imported and permanently saved ${bulkParsedProducts.length} products to database!`, 'success');
    } catch (err) {
      for (const p of bulkParsedProducts) {
        addProduct(p as any);
      }
      showNotification(`Imported ${bulkParsedProducts.length} products!`, 'success');
    } finally {
      setIsImporting(false);
      setIsBulkModalOpen(false);
      setBulkParsedProducts([]);
      setBulkFileName('');
    }
  };

  return (
    <div className="p-6 space-y-6 text-slate-900">
      
      {/* Top Banner & Summary Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase">
              Amazon-Style B2B Seller Catalog
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Full Multi-Media & SEO Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
            Product Listings & Multi-Media Hub
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1 max-w-3xl">
            Manage comprehensive Amazon-style product pages with multi-photo galleries, video demos, downloadable 3D CAD/brochures, 5-point feature highlights, and backend hidden SEO search terms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs py-2.5 px-4 shadow-xs flex items-center gap-2 font-bold cursor-pointer"
            title="Download full catalog as CSV"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setBulkParsedProducts([]);
              setBulkFileName('');
              setBulkError(null);
              setIsBulkModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-orange-600" />
            <span>Bulk Excel / CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn-primary text-xs py-2.5 px-4 shadow-md flex items-center gap-2 font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Catalog KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase">Total Catalog SKUs</p>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{products.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-orange-200 bg-orange-50/30 shadow-xs">
          <p className="text-[10px] font-mono text-orange-700 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Home Showcase
          </p>
          <p className="text-xl font-extrabold text-orange-700 font-mono mt-1">
            {products.filter(p => p.featured).length} <span className="text-xs text-orange-500 font-normal">/ 12 on Home</span>
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Active & In Stock</p>
          <p className="text-xl font-extrabold text-emerald-700 font-mono mt-1">
            {products.filter(p => (p.status || 'Active') === 'Active' && p.inStock).length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-mono text-blue-700 font-bold uppercase">Video & 3D CAD</p>
          <p className="text-xl font-extrabold text-blue-700 font-mono mt-1">
            {products.filter(p => p.videoUrl || p.cadDrawingUrl).length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-[10px] font-mono text-purple-700 font-bold uppercase">SEO Terms Indexed</p>
          <p className="text-xl font-extrabold text-purple-700 font-mono mt-1">
            {products.reduce((acc, p) => acc + (p.seoKeywords?.length || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Title, SKU, Model # or Hidden SEO Keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Home Showcase Filter */}
          <select
            value={homeFeaturedFilter}
            onChange={e => setHomeFeaturedFilter(e.target.value as any)}
            className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-xs font-mono font-bold text-orange-900 focus:outline-none"
          >
            <option value="All">All Showcase Views</option>
            <option value="Featured on Home">⭐ Featured on Home ({products.filter(p => p.featured).length})</option>
            <option value="Catalog Only">📁 Catalog Only ({products.filter(p => !p.featured).length})</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Draft">Drafts</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Media Filter */}
          <select
            value={mediaFilter}
            onChange={e => setMediaFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Media Types</option>
            <option value="Has Video">Has Video Demo</option>
            <option value="Has CAD">Has 3D CAD STEP</option>
            <option value="Has Brochure">Has PDF Brochure</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-500 font-bold shrink-0">
          Showing <strong>{filteredProducts.length}</strong> of {products.length} Products
        </div>
      </div>

      {/* Amazon Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
                <th className="p-3.5 font-bold">IMAGE</th>
                <th className="p-3.5 font-bold">PRODUCT TITLE & IDENTIFIERS</th>
                <th className="p-3.5 font-bold">CATEGORY & SUB-TYPE</th>
                <th className="p-3.5 font-bold">HOME SHOWCASE (MAX 12)</th>
                <th className="p-3.5 font-bold">MULTI-MEDIA ASSETS</th>
                <th className="p-3.5 font-bold">COMMERCIALS</th>
                <th className="p-3.5 font-bold">HIDDEN SEO TERMS</th>
                <th className="p-3.5 font-bold">STATUS</th>
                <th className="p-3.5 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Thumbnail */}
                  <td className="p-3.5">
                    <div className="relative w-14 h-14 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0 shadow-xs">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {p.gallery && p.gallery.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white font-mono text-[9px] px-1 rounded-tl font-bold">
                          +{p.gallery.length}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Title & SKU */}
                  <td className="p-3.5 max-w-xs">
                    <p className="font-bold text-slate-900 line-clamp-1 hover:text-orange-700 cursor-pointer" onClick={() => setViewingProduct(p)}>
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                      <span className="bg-slate-100 text-slate-800 font-bold px-1.5 py-0.5 rounded border border-slate-200">
                        SKU: {p.sku}
                      </span>
                      {p.modelNumber && (
                        <span className="text-slate-500">M: {p.modelNumber}</span>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 block">{p.category}</span>
                    <span className="text-[10px] font-mono text-slate-500 block">{p.subCategory || 'Standard Series'}</span>
                  </td>

                  {/* Home Showcase Toggle */}
                  <td className="p-3.5">
                    {p.featured ? (
                      <button
                        onClick={() => {
                          updateProduct(p.id, { featured: false });
                          showNotification(`Removed "${p.name}" from Homepage Showcase.`, 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        title="Click to remove from Homepage"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                        <span>Featured on Home</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          updateProduct(p.id, { featured: true });
                          showNotification(`Added "${p.name}" to Homepage Showcase (Max 12 displayed)!`, 'success');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-500 hover:text-orange-700 border border-slate-200 hover:border-orange-200 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                        title="Click to showcase on Homepage (Max 12 on Home)"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Catalog Only</span>
                      </button>
                    )}
                  </td>

                  {/* Multi-Media Pills */}
                  <td className="p-3.5">
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {p.gallery?.length || 1} Photos
                      </span>
                      {p.videoUrl && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                      {p.cadDrawingUrl && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                          <FileCode className="w-3 h-3" /> 3D CAD
                        </span>
                      )}
                      {p.catalogPdfUrl && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pricing & MOQ */}
                  <td className="p-3.5 font-mono">
                    <div className="font-bold text-slate-900">₹{p.priceUSD || 150} INR</div>
                    <div className="text-[11px] text-slate-500">MOQ: {p.minOrderQty} pcs | {p.standardLeadTimeDays}d</div>
                  </td>

                  {/* Hidden SEO Keywords */}
                  <td className="p-3.5 max-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {p.seoKeywords && p.seoKeywords.length > 0 ? (
                        <>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold truncate max-w-[120px]">
                            {p.seoKeywords[0]}
                          </span>
                          {p.seoKeywords.length > 1 && (
                            <span className="text-[9px] font-mono bg-orange-50 text-orange-800 px-1.5 py-0.5 rounded border border-orange-200 font-bold">
                              +{p.seoKeywords.length - 1} terms
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 italic">No search terms</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span className={`px-2 py-1 rounded-md font-mono text-[10px] font-bold border ${
                      (p.status || 'Active') === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : (p.status === 'Draft' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-300')
                    }`}>
                      {p.status || 'Active'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingProduct(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="View Amazon Detail Page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 rounded-lg text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-colors"
                        title="Edit Listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AMAZON-STYLE PRODUCT ADD / EDIT MULTI-TAB MODAL */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] my-8 overflow-hidden font-sans">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingProduct ? 'Edit Amazon-Style Listing' : 'Create New Amazon-Style Product Listing'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    SKU: <strong>{formData.sku || 'Auto-generated'}</strong> • Category: {formData.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amazon Listing Multi-Tab Navigation */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-white shrink-0 overflow-x-auto text-xs font-mono font-bold">
              <button
                onClick={() => setActiveFormTab('vital')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === 'vital' ? 'border-orange-600 text-orange-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Vital Info
              </button>
              <button
                onClick={() => setActiveFormTab('bullets')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === 'bullets' ? 'border-orange-600 text-orange-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Bullet Points & A+ Text
              </button>
              <button
                onClick={() => setActiveFormTab('media')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === 'media' ? 'border-orange-600 text-orange-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                3. Photos, Video & CAD
              </button>
              <button
                onClick={() => setActiveFormTab('specs')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === 'specs' ? 'border-orange-600 text-orange-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                4. Specs Matrix
              </button>
              <button
                onClick={() => setActiveFormTab('pricing')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeFormTab === 'pricing' ? 'border-orange-600 text-orange-800' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                5. Commercials & Inventory
              </button>
              <button
                onClick={() => setActiveFormTab('seo')}
                className={`py-3 px-3.5 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeFormTab === 'seo' ? 'border-orange-600 text-orange-800 bg-orange-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-orange-600" />
                <span>6. Hidden SEO Search Terms</span>
              </button>
            </div>

            {/* Modal Body Form Scroll Area */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: VITAL INFO */}
              {activeFormTab === 'vital' && (
                <div className="space-y-4">
                  {/* Homepage Showcase Switch Card */}
                  <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-mono font-bold text-slate-900">Showcase on Homepage (Top 12 Display)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        When enabled, this product is selected for the Homepage category showcase (Maximum 12 products are displayed on Home, all products stored in Catalog).
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input 
                        type="checkbox" 
                        checked={formData.featured} 
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. ISO 15552 Heavy-Duty Pneumatic Cylinder"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        SKU / Part Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g. WEL-PNC-4010"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Model Number / Series
                      </label>
                      <input
                        type="text"
                        value={formData.modelNumber}
                        onChange={e => setFormData({ ...formData, modelNumber: e.target.value })}
                        placeholder="e.g. PNC-4010-HD"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Primary Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-orange-500 focus:outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Sub-Category / Division
                      </label>
                      <input
                        type="text"
                        value={formData.subCategory}
                        onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                        placeholder="e.g. ISO 15552 Cylinders"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Brand / Manufacturer
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Listing Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-orange-500 focus:outline-none"
                      >
                        <option value="Active">Active (Visible in Catalog)</option>
                        <option value="Draft">Draft (Internal Only)</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BULLET POINTS & DESCRIPTION */}
              {activeFormTab === 'bullets' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Product Tagline (High Impact One-Liner)
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. High-cycle double acting cylinder with magnetic piston..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono font-bold text-slate-700">
                        Amazon 5 Key Feature Bullet Points
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">Appears at the top of the product page</span>
                    </div>

                    <div className="space-y-2">
                      {formData.bulletPoints.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 text-center font-mono font-bold text-orange-600 text-xs shrink-0">{idx + 1}.</span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={e => {
                              const updated = [...formData.bulletPoints];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, bulletPoints: updated });
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:border-orange-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.bulletPoints.filter((_, i) => i !== idx);
                              setFormData({ ...formData, bulletPoints: updated });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {formData.bulletPoints.length < 8 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, bulletPoints: [...formData.bulletPoints, ''] })}
                          className="text-xs font-mono text-orange-700 hover:underline flex items-center gap-1 mt-1 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Detailed Engineering Description (A+ Style)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive technical details, manufacturing processes, and material specifications..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PHOTOS, VIDEO & CAD */}
              {activeFormTab === 'media' && (
                <div className="space-y-6">
                  
                  {/* Primary Thumbnail Image */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 uppercase font-mono">1. Primary Product Thumbnail Photo</h4>
                        <p className="text-[11px] text-slate-500">Main hero image shown on search cards and catalog index</p>
                      </div>
                      <label className="btn-secondary text-xs py-1.5 px-3 cursor-pointer shadow-xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-orange-600" />
                        <span>Upload File</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'image')} />
                      </label>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                        <img src={formData.image} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Image URL https://..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Multiple Gallery Photos */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 uppercase font-mono">2. Multiple High-Res Gallery Photos ({formData.gallery.length})</h4>
                        <p className="text-[11px] text-slate-500">Multi-angle photos, CAD cutaway renders, and installation views</p>
                      </div>

                      <label className="btn-secondary text-xs py-1.5 px-3 cursor-pointer shadow-xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-orange-600" />
                        <span>Add Photo File</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'gallery')} />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.gallery.map((imgUrl, i) => (
                        <div key={i} className="relative group rounded-xl border border-slate-300 overflow-hidden bg-white shadow-xs aspect-square">
                          <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, idx) => idx !== i) })}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Demo Video */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 uppercase font-mono">3. Product Demo Video (MP4 / YouTube / Vimeo)</h4>
                        <p className="text-[11px] text-slate-500">Embedded video demo player shown directly on public product detail page</p>
                      </div>

                      <label className="btn-secondary text-xs py-1.5 px-3 cursor-pointer shadow-xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-purple-600" />
                        <span>Upload Video</span>
                        <input type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, 'videoUrl')} />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="Video URL https://www.w3schools.com/html/mov_bbb.mp4"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:border-orange-500 focus:outline-none"
                    />

                    {formData.videoUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-300 max-w-sm bg-black">
                        <video src={formData.videoUrl} controls className="w-full h-36 object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Catalog PDF & 3D CAD Attachments */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 uppercase font-mono flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" /> Catalog / Brochure PDF
                        </h4>
                        <label className="text-[10px] font-mono text-orange-700 font-bold hover:underline cursor-pointer">
                          Upload PDF
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleFileUpload(e, 'catalogPdfUrl')} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.catalogPdfUrl}
                        onChange={e => setFormData({ ...formData, catalogPdfUrl: e.target.value })}
                        placeholder="PDF Link https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 uppercase font-mono flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-amber-600" /> 3D CAD Model (.STEP / .DWG)
                        </h4>
                        <label className="text-[10px] font-mono text-orange-700 font-bold hover:underline cursor-pointer">
                          Upload CAD
                          <input type="file" accept=".step,.stp,.iges,.igs,.dxf,.dwg" className="hidden" onChange={e => handleFileUpload(e, 'cadDrawingUrl')} />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={formData.cadDrawingUrl}
                        onChange={e => setFormData({ ...formData, cadDrawingUrl: e.target.value })}
                        placeholder="3D STEP Link https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: TECHNICAL SPECS MATRIX */}
              {activeFormTab === 'specs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase font-mono">Dynamic Technical Specifications Table</h4>
                      <p className="text-[11px] text-slate-500">Key engineering parameters displayed in the technical spec sheet</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-600" /> Add Spec Parameter
                    </button>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-mono text-slate-700 border-b border-slate-200">
                          <th className="p-2.5 font-bold">PARAMETER NAME</th>
                          <th className="p-2.5 font-bold">VALUE / RATING</th>
                          <th className="p-2.5 font-bold">UNIT</th>
                          <th className="p-2.5 text-right font-bold w-12">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formData.specifications.map((spec, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50">
                            <td className="p-2">
                              <input
                                type="text"
                                value={spec.label}
                                onChange={e => handleUpdateSpecRow(sIdx, 'label', e.target.value)}
                                placeholder="e.g. Operating Pressure"
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={spec.value}
                                onChange={e => handleUpdateSpecRow(sIdx, 'value', e.target.value)}
                                placeholder="e.g. 700 Bar"
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                              />
                            </td>
                            <td className="p-2 w-24">
                              <input
                                type="text"
                                value={spec.unit || ''}
                                onChange={e => handleUpdateSpecRow(sIdx, 'unit', e.target.value)}
                                placeholder="Bar / mm"
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecRow(sIdx)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: PRICING & INVENTORY */}
              {activeFormTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        B2B Unit Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={formData.priceUSD}
                        onChange={e => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        B2B Unit Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        value={formData.priceINR}
                        onChange={e => setFormData({ ...formData, priceINR: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Minimum Order Qty (MOQ)
                      </label>
                      <input
                        type="number"
                        value={formData.minOrderQty}
                        onChange={e => setFormData({ ...formData, minOrderQty: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Standard Lead Time (Days)
                      </label>
                      <input
                        type="number"
                        value={formData.standardLeadTimeDays}
                        onChange={e => setFormData({ ...formData, standardLeadTimeDays: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                        />
                        <span>In Stock / Fast Dispatch</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: AMAZON BACKEND SEARCH TERMS & HIDDEN SEO */}
              {activeFormTab === 'seo' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold font-mono text-orange-900 uppercase">
                        Amazon Backend Search Terms (Hidden SEO Keywords)
                      </h4>
                      <p className="text-xs text-orange-800 mt-0.5">
                        These keywords are indexed by the search engine and the public search bar, but they are <strong>never shown to buyers</strong> on the frontend product cards.
                      </p>
                    </div>
                  </div>

                  {/* Search Terms Input */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Add Backend Search Term Keyword (Press Enter or Add)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={e => setNewKeywordInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="e.g. double acting cylinder, 700 bar ram, iso 15552 valve..."
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="btn-secondary text-xs py-2.5 px-4 font-bold shadow-xs"
                      >
                        <Plus className="w-4 h-4 text-orange-600" /> Add Term
                      </button>
                    </div>

                    {/* Keywords Tag List */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.seoKeywords.map((kw, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-mono font-semibold text-slate-800">
                          <span>{kw}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.seoMetaTitle}
                        onChange={e => setFormData({ ...formData, seoMetaTitle: e.target.value })}
                        placeholder="Custom page title for search engine results..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        SEO Meta Description
                      </label>
                      <input
                        type="text"
                        value={formData.seoMetaDescription}
                        onChange={e => setFormData({ ...formData, seoMetaDescription: e.target.value })}
                        placeholder="Meta snippet description for Google SERP..."
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-4 font-bold"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {activeFormTab !== 'seo' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: Array<'vital' | 'bullets' | 'media' | 'specs' | 'pricing' | 'seo'> = ['vital', 'bullets', 'media', 'specs', 'pricing', 'seo'];
                        const nextIdx = tabs.indexOf(activeFormTab) + 1;
                        if (nextIdx < tabs.length) setActiveFormTab(tabs[nextIdx]);
                      }}
                      className="btn-secondary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
                    >
                      <span>Next Section</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="btn-primary text-xs py-2.5 px-6 font-bold shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProduct ? 'Save & Update Product' : 'Publish Product Listing'}</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* AMAZON-STYLE RICH PRODUCT VIEW MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-4xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-sans my-8">
            
            <button
              onClick={() => setViewingProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Multi-photo Gallery & Video Player */}
              <div className="md:col-span-5 space-y-4">
                <div className="aspect-square rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-xs">
                  <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-full object-cover" />
                </div>

                {viewingProduct.gallery && viewingProduct.gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {viewingProduct.gallery.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 cursor-pointer shadow-xs">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {viewingProduct.videoUrl && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                    <p className="text-xs font-bold text-purple-900 font-mono flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-purple-600" /> Technical Product Demo Video
                    </p>
                    <video src={viewingProduct.videoUrl} controls className="w-full rounded-lg h-32 object-cover bg-black" />
                  </div>
                )}

                {/* Downloadable Assets */}
                <div className="space-y-2">
                  {viewingProduct.catalogPdfUrl && (
                    <a
                      href={viewingProduct.catalogPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" /> Download PDF Brochure
                      </span>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  )}

                  {viewingProduct.cadDrawingUrl && (
                    <a
                      href={viewingProduct.cadDrawingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-amber-600" /> Download 3D CAD (.STEP)
                      </span>
                      <Download className="w-4 h-4 text-slate-500" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Amazon-Style Product Details & 5 Bullet Points */}
              <div className="md:col-span-7 space-y-5">
                
                <div>
                  <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-md">
                    {viewingProduct.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mt-2">
                    {viewingProduct.name}
                  </h2>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    SKU: <strong>{viewingProduct.sku}</strong> | Brand: <strong>{viewingProduct.brand || 'WELDOR PRECISION'}</strong>
                  </p>
                </div>

                {/* Price Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">B2B Commercial Price</span>
                    <span className="text-2xl font-black text-slate-900 font-mono">₹{viewingProduct.priceUSD || 150} INR</span>
                    {viewingProduct.priceINR && (
                      <span className="text-xs font-mono text-slate-500 ml-2">(₹{viewingProduct.priceINR.toLocaleString()} INR)</span>
                    )}
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    MOQ: {viewingProduct.minOrderQty} units
                  </span>
                </div>

                {/* Amazon 5 Bullet Points */}
                {viewingProduct.bulletPoints && viewingProduct.bulletPoints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-extrabold text-slate-800 uppercase tracking-wider">
                      About This Industrial Item:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4 font-medium">
                      {viewingProduct.bulletPoints.map((bp, i) => (
                        <li key={i} className="leading-relaxed">{bp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications Matrix */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-extrabold text-slate-800 uppercase tracking-wider">
                    Technical Specifications:
                  </h4>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-slate-100">
                        {viewingProduct.specifications.map((s, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-700 bg-slate-50/70 w-1/2">{s.label}</td>
                            <td className="p-2.5 font-mono text-slate-900">{s.value} {s.unit || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Backend Hidden SEO Keywords Inspector (Admin View Only) */}
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-orange-900 uppercase flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-orange-600" /> Backend Hidden SEO Search Terms
                    </span>
                    <span className="text-[10px] font-mono text-orange-700 bg-white px-2 py-0.5 rounded border border-orange-200 font-bold">
                      Hidden from Public Buyers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {viewingProduct.seoKeywords && viewingProduct.seoKeywords.length > 0 ? (
                      viewingProduct.seoKeywords.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-orange-200 font-mono text-[10px] font-semibold">
                          {k}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No search terms configured.</span>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* BULK EXCEL / CSV IMPORT MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                    Bulk Product Catalog Import (Excel / CSV)
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Upload dozens or hundreds of products at once with automatically parsed categories, specifications, and images.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Step 1: Download Sample Template */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-mono text-orange-900 uppercase flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-orange-600" /> Step 1: Download Standard Spreadsheet Template
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Use our pre-configured CSV template with pre-mapped columns for Name, SKU, Category, Prices, Specs, and SEO keywords.
                  </p>
                </div>

                <button
                  onClick={handleDownloadTemplate}
                  className="btn-secondary text-xs py-2 px-4 shadow-xs flex items-center gap-1.5 font-bold shrink-0 bg-white"
                >
                  <Download className="w-3.5 h-3.5 text-orange-600" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* Step 2: Upload File Area */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-slate-700 uppercase">
                  Step 2: Upload Completed Product CSV / Excel Sheet
                </h4>

                <div className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-orange-50/20 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {bulkFileName ? `Selected: ${bulkFileName}` : 'Click to browse or drag & drop CSV file here'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Supports standard UTF-8 comma separated (.csv) files
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {bulkError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bulkError}</span>
                </div>
              )}

              {/* Step 3: Real-Time Parsed Products Preview Table */}
              {bulkParsedProducts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono text-slate-800 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ready to Import: {bulkParsedProducts.length} Products Detected
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">Review before confirming</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-x-auto max-h-60">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 font-mono text-slate-700 sticky top-0">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">PRODUCT NAME</th>
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">CATEGORY</th>
                          <th className="p-2.5">PRICE (₹ INR)</th>
                          <th className="p-2.5">SPECS</th>
                          <th className="p-2.5">HOME SHOWCASE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {bulkParsedProducts.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900 font-sans max-w-xs truncate">{p.name}</td>
                            <td className="p-2.5 text-orange-700 font-bold">{p.sku}</td>
                            <td className="p-2.5 text-slate-600">{p.category}</td>
                            <td className="p-2.5 font-bold">₹{p.priceUSD || 100}</td>
                            <td className="p-2.5 text-slate-500">{p.specifications?.length || 0} specs</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.featured ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {p.featured ? '⭐ Home (Max 12)' : 'Catalog'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setBulkParsedProducts([]);
                  setBulkFileName('');
                  setIsBulkModalOpen(false);
                }}
                className="btn-secondary text-xs py-2.5 px-4"
              >
                Cancel
              </button>

              <button
                onClick={handleCommitBulkImport}
                disabled={bulkParsedProducts.length === 0 || isImporting}
                className={`btn-primary text-xs py-2.5 px-6 shadow-md flex items-center gap-2 font-bold ${
                  bulkParsedProducts.length === 0 || isImporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isImporting ? 'Importing Products...' : `Import All ${bulkParsedProducts.length} Products`}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
