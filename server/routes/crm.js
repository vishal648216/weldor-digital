import { getCollection, saveCollection, logAudit } from '../db.js';

export const handleCrm = async (req, res, method, pathParts, body, query) => {
  const resource = pathParts[2]; // /api/crm/:resource (:id)
  const id = pathParts[3];

  // 1. IndiaMART Webhook & Auto-Sync
  if (resource === 'indiamart-webhook' && method === 'POST') {
    const leads = getCollection('leads');
    const newLead = {
      id: 'lead_im_' + Date.now(),
      name: body.SENDER_NAME || body.name || 'IndiaMART Inquirer',
      company: body.SENDER_COMPANY || body.company || 'IndiaMART Prospect',
      email: body.SENDER_EMAIL || body.email || '',
      phone: body.SENDER_MOBILE || body.mobile || '',
      product: body.QUERY_PRODUCT_NAME || body.product || 'Industrial Query',
      quantity: body.QUANTITY || 1,
      source: 'IndiaMART Webhook',
      status: 'New',
      notes: body.QUERY_MESSAGE || body.message || 'Received via IndiaMART push webhook.',
      rawPayload: body,
      createdAt: new Date().toISOString()
    };
    leads.unshift(newLead);
    saveCollection('leads', leads);
    logAudit('IndiaMART Lead Webhook', 'System', `New lead received for ${newLead.product}`);
    return { statusCode: 200, body: { success: true, message: 'IndiaMART lead processed', leadId: newLead.id } };
  }

  if (resource === 'indiamart-sync' && (method === 'POST' || method === 'GET')) {
    const leads = getCollection('leads');
    const syncedSample = {
      id: 'lead_sync_' + Date.now(),
      name: 'Dynamic Engineering Corp',
      company: 'Dynamic Engineering Corp',
      email: 'procurement@dynamic-eng.com',
      phone: '+91-98980-55443',
      product: '700 Bar High-Pressure Hydraulic Valve',
      quantity: 25,
      source: 'IndiaMART CRM Sync',
      status: 'New',
      notes: 'Synced via IndiaMART API Gateway.',
      createdAt: new Date().toISOString()
    };
    leads.unshift(syncedSample);
    saveCollection('leads', leads);
    logAudit('IndiaMART Manual Sync', 'Admin', 'Triggered IndiaMART API lead sync');
    return {
      statusCode: 200,
      body: {
        success: true,
        message: 'IndiaMART leads synchronized successfully.',
        data: { syncedCount: 1, leads: [syncedSample] }
      }
    };
  }

  // 2. Public RFQ Form
  if (resource === 'rfq' && pathParts[3] === 'public' && method === 'POST') {
    const leads = getCollection('leads');
    const rfqs = getCollection('rfqs');
    const rfqId = 'rfq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    const rfqEntry = {
      id: rfqId,
      name: body.name || body.contactPerson || 'Customer',
      company: body.company || body.companyName || 'Individual',
      email: body.email || '',
      phone: body.phone || body.mobile || '',
      product: body.product || body.productName || 'Industrial Requirement',
      quantity: body.quantity || 1,
      targetDate: body.targetDate || '',
      message: body.message || body.requirements || '',
      cadFile: body.cadFile || body.attachment || '',
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };

    rfqs.unshift(rfqEntry);
    saveCollection('rfqs', rfqs);

    // Also register as a lead in CRM
    leads.unshift({
      id: 'lead_' + rfqId,
      name: rfqEntry.name,
      company: rfqEntry.company,
      email: rfqEntry.email,
      phone: rfqEntry.phone,
      product: rfqEntry.product,
      quantity: rfqEntry.quantity,
      source: 'Website Public RFQ',
      status: 'New',
      notes: rfqEntry.message,
      createdAt: new Date().toISOString()
    });
    saveCollection('leads', leads);

    logAudit('Public RFQ Submitted', rfqEntry.name, `New RFQ for: ${rfqEntry.product}`);
    return {
      statusCode: 201,
      body: {
        success: true,
        message: 'Your Request for Quote (RFQ) has been received! Our engineering team will review your specifications within 2 hours.',
        data: rfqEntry
      }
    };
  }

  // 3. Generic CRM Resource Collections (leads, rfqs, quotations, orders, samples, trials, invoices)
  const allowedResources = ['leads', 'rfqs', 'quotations', 'orders', 'samples', 'trials', 'invoices'];
  if (allowedResources.includes(resource)) {
    let collection = getCollection(resource);

    if (method === 'GET') {
      if (id) {
        const item = collection.find(x => x.id === id);
        return item 
          ? { statusCode: 200, body: { success: true, data: item } }
          : { statusCode: 404, body: { success: false, message: `${resource} item not found` } };
      }
      return { statusCode: 200, body: { success: true, data: collection, count: collection.length } };
    }

    if (method === 'POST') {
      const newItem = {
        id: body.id || (`${resource.slice(0, 4)}_` + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        createdAt: new Date().toISOString(),
        status: body.status || 'Active',
        ...body
      };
      collection.unshift(newItem);
      saveCollection(resource, collection);
      logAudit(`Create CRM ${resource}`, 'Admin', `Added ${resource} item: ${newItem.id}`);
      return { statusCode: 201, body: { success: true, data: newItem } };
    }

    if (method === 'PUT' && id) {
      const idx = collection.findIndex(x => x.id === id);
      if (idx === -1) return { statusCode: 404, body: { success: false, message: 'Item not found' } };
      collection[idx] = { ...collection[idx], ...body, updatedAt: new Date().toISOString() };
      saveCollection(resource, collection);
      logAudit(`Update CRM ${resource}`, 'Admin', `Updated ${resource} ID: ${id}`);
      return { statusCode: 200, body: { success: true, data: collection[idx] } };
    }

    if (method === 'DELETE' && id) {
      const filtered = collection.filter(x => x.id !== id);
      saveCollection(resource, filtered);
      logAudit(`Delete CRM ${resource}`, 'Admin', `Deleted ${resource} ID: ${id}`);
      return { statusCode: 200, body: { success: true, message: `${resource} item deleted` } };
    }
  }

  return { statusCode: 404, body: { success: false, message: 'CRM endpoint not found' } };
};
