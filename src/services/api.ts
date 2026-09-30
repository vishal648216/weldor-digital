const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api';

export const api = {
  // --- Products ---
  getProducts: async (params?: { category?: string; search?: string; industry?: string }) => {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      return await res.json();
    } catch (e) {
      console.warn('API getProducts fallback:', e);
      return { success: false, data: [] };
    }
  },
  getProductById: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      return await res.json();
    } catch (e) {
      return { success: false, data: null };
    }
  },
  createProduct: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateProduct: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteProduct: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  bulkCreateProducts: async (products: any[]) => {
    try {
      const res = await fetch(`${API_BASE}/products/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data: products };
    }
  },

  // --- Exhibitions ---
  getExhibitions: async (status?: string) => {
    try {
      const res = await fetch(`${API_BASE}/exhibitions${status ? `?status=${status}` : ''}`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  getExhibitionBySlug: async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE}/exhibitions/slug/${slug}`);
      return await res.json();
    } catch (e) {
      return { success: false, data: null };
    }
  },
  createExhibition: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/exhibitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateExhibition: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/exhibitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteExhibition: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/exhibitions/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Categories ---
  getCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createCategory: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateCategory: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteCategory: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Hero Banners ---
  getBanners: async () => {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createBanner: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateBanner: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteBanner: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  reorderBanners: async (bannerIds: string[]) => {
    try {
      const res = await fetch(`${API_BASE}/banners/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerIds }),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Gallery Media ---
  getGallery: async (params?: { type?: string; category?: string }) => {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE}/gallery?${query}`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createGallery: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateGallery: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteGallery: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  bulkCreateGalleryItems: async (items: any[]) => {
    try {
      const res = await fetch(`${API_BASE}/gallery/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data: items };
    }
  },

  // --- CRM & Leads ---
  getLeads: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/leads`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createLead: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateLead: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteLead: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/leads/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  submitPublicRFQ: async (rfqData: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/rfq/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfqData),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Quotations & Orders ---
  getQuotations: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/quotations`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createQuotation: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateQuotation: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteQuotation: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/quotations/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  getOrders: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/orders`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createOrder: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateOrder: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteOrder: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/orders/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  // --- RFQs ---
  getRfqs: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/rfqs`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createRfq: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/rfqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateRfq: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/rfqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteRfq: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/rfqs/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Samples & Trials ---
  getSamples: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/samples`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createSample: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/samples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateSample: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/samples/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteSample: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/samples/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  getTrials: async () => {
    try {
      const res = await fetch(`${API_BASE}/crm/trials`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createTrial: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/trials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateTrial: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/crm/trials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteTrial: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/crm/trials/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- HRMS & Employees ---
  getEmployees: async () => {
    try {
      const res = await fetch(`${API_BASE}/hrms/employees`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createEmployee: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateEmployee: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteEmployee: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/employees/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Roles & RBAC ---
  getRoles: async () => {
    try {
      const res = await fetch(`${API_BASE}/hrms/roles`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createRole: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateRole: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deleteRole: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/roles/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Payroll ---
  getPayroll: async () => {
    try {
      const res = await fetch(`${API_BASE}/hrms/payroll`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createPayroll: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/payroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  bulkCreatePayroll: async (records: any[]) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/payroll/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data: records };
    }
  },
  updatePayroll: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/payroll/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  deletePayroll: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/payroll/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // --- Attendance & Leaves ---
  getAttendance: async () => {
    try {
      const res = await fetch(`${API_BASE}/hrms/attendance`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createAttendance: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateAttendance: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  getLeaves: async () => {
    try {
      const res = await fetch(`${API_BASE}/hrms/leaves`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createLeave: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  updateLeave: async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/hrms/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },

  // --- Settings & Audit ---
  getSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/company`);
      return await res.json();
    } catch (e) {
      return { success: false, data: null };
    }
  },
  updateSettings: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/settings/company`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },
  getAuditLogs: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/audit-logs`);
      return await res.json();
    } catch (e) {
      return { success: false, data: [] };
    }
  },
  createAuditLog: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE}/settings/audit-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      return { success: false, data };
    }
  },

  // --- Upload Engine (Cloudinary CDN Optimized) ---
  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Upload failed' };
    }
  },
  uploadBulkFiles: async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await fetch(`${API_BASE}/upload/bulk`, {
        method: 'POST',
        body: formData,
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Bulk upload failed' };
    }
  },

  // --- Authentication & Session Management ---
  login: async (credentials: { email: string; password: string; deviceName?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return await res.json();
    } catch (e) {
      return { success: false, message: 'Server connection failed.' };
    }
  },
  logout: async (token?: string, userId?: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['x-session-token'] = token;
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId }),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },
  verifySession: async (token: string, userId?: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-session-token': token,
      };
      if (userId) headers['x-user-id'] = userId;
      const res = await fetch(`${API_BASE}/auth/verify-session${userId ? `?userId=${userId}` : ''}`, {
        method: 'GET',
        headers,
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'NETWORK_ERROR' };
    }
  },
};

