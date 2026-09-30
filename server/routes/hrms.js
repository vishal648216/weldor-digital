import { getCollection, saveCollection, logAudit } from '../db.js';

export const handleHrms = async (req, res, method, pathParts, body, query) => {
  const resource = pathParts[2]; // /api/hrms/:resource (:id)
  const id = pathParts[3];

  if (resource === 'payroll' && id === 'bulk' && method === 'POST') {
    const payroll = getCollection('payroll');
    const employees = getCollection('employees');
    const month = body.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const generated = employees.map(emp => ({
      id: 'pay_' + Date.now() + '_' + emp.id,
      employeeId: emp.id,
      employeeName: emp.name,
      month,
      basicSalary: emp.salary || 50000,
      allowances: 5000,
      deductions: 2000,
      netSalary: (emp.salary || 50000) + 3000,
      status: 'Processed',
      paidAt: new Date().toISOString()
    }));

    const updated = [...payroll, ...generated];
    saveCollection('payroll', updated);
    logAudit('Bulk Payroll Processed', 'Admin', `Generated payroll for ${generated.length} employees for ${month}`);
    return { statusCode: 200, body: { success: true, count: generated.length, data: generated } };
  }

  const allowedResources = ['employees', 'roles', 'attendance', 'leaves', 'payroll'];
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
        id: body.id || (`${resource.slice(0, 3)}_` + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        createdAt: new Date().toISOString(),
        status: body.status || 'Active',
        ...body
      };
      collection.unshift(newItem);
      saveCollection(resource, collection);
      logAudit(`Create HRMS ${resource}`, 'Admin', `Added ${resource} item: ${newItem.id}`);
      return { statusCode: 201, body: { success: true, data: newItem } };
    }

    if (method === 'PUT' && id) {
      const idx = collection.findIndex(x => x.id === id);
      if (idx === -1) return { statusCode: 404, body: { success: false, message: 'Item not found' } };
      collection[idx] = { ...collection[idx], ...body, updatedAt: new Date().toISOString() };
      saveCollection(resource, collection);
      logAudit(`Update HRMS ${resource}`, 'Admin', `Updated ${resource} ID: ${id}`);
      return { statusCode: 200, body: { success: true, data: collection[idx] } };
    }

    if (method === 'DELETE' && id) {
      const filtered = collection.filter(x => x.id !== id);
      saveCollection(resource, filtered);
      logAudit(`Delete HRMS ${resource}`, 'Admin', `Deleted ${resource} ID: ${id}`);
      return { statusCode: 200, body: { success: true, message: `${resource} item deleted` } };
    }
  }

  return { statusCode: 404, body: { success: false, message: 'HRMS endpoint not found' } };
};
