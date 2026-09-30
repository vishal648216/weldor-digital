import { getCollection, saveCollection, logAudit } from '../db.js';

const DEFAULT_SETTINGS = {
  companyName: "Weldor by Earth Metal Industries",
  brandName: "WELDOR",
  legalName: "Earth Metal Industries",
  cinNumber: "U29299GJ2005PTC045890",
  gstin: "24AAACW1234F1Z5",
  panNumber: "AAACW1234F",
  iecCode: "0812345678",
  msmeRegistrationNo: "UDYAM-GJ-15-0012345",
  registeredOfficeAddress: {
    addressLine1: "Plot No. 588, Phase 2, GIDC Industrial Estate",
    addressLine2: "Dared",
    city: "Jamnagar",
    state: "Gujarat",
    country: "India",
    pincode: "361004"
  },
  primaryEmail: "director@weldorindustries.com",
  primaryPhone: "+91-98250-11223",
  websiteUrl: "https://weldorindustries.com",
  bankAccounts: [],
  primaryBank: {
    bankName: "HDFC Bank Ltd",
    accountName: "Earth Metal Industries",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234",
    branch: "Dared GIDC, Jamnagar"
  },
  slaSettings: {
    leadResponseHours: 2,
    quoteApprovalThresholdUSD: 50000,
    autoAssignSalesLead: true,
    enableWhatsAppNotifications: true,
    enablePayrollReminderDays: 5
  },
  isoCertified: true
};

export const handleSettings = async (req, res, method, pathParts, body) => {
  const resource = pathParts[2]; // /api/settings/:resource

  if (!resource || resource === 'company') {
    let settings = getCollection('settings');
    const merged = {
      ...DEFAULT_SETTINGS,
      ...settings,
      primaryBank: { ...DEFAULT_SETTINGS.primaryBank, ...(settings.primaryBank || {}) },
      registeredOfficeAddress: { ...DEFAULT_SETTINGS.registeredOfficeAddress, ...(settings.registeredOfficeAddress || {}) },
      slaSettings: { ...DEFAULT_SETTINGS.slaSettings, ...(settings.slaSettings || {}) }
    };

    if (method === 'GET') {
      return { statusCode: 200, body: { success: true, data: merged } };
    }
    if (method === 'PUT' || method === 'POST') {
      settings = { ...merged, ...body, updatedAt: new Date().toISOString() };
      saveCollection('settings', settings);
      logAudit('Update Company Settings', 'Admin', 'Updated company profile details');
      return { statusCode: 200, body: { success: true, data: settings } };
    }
  }

  if (resource === 'audit-logs' && method === 'GET') {
    const logs = getCollection('auditLogs');
    return { statusCode: 200, body: { success: true, data: logs } };
  }

  return { statusCode: 404, body: { success: false, message: 'Settings endpoint not found' } };
};

export const handleUpload = async (req, res, method, pathParts, body) => {
  // Returns mock or URL references for uploaded files
  if (method === 'POST') {
    const isBulk = pathParts[2] === 'bulk';
    if (isBulk) {
      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'Files uploaded successfully',
          urls: [
            '/extracted_images/p2_img1_1570x1467.jpeg',
            '/extracted_images/p3_img1_1382x1467.jpeg'
          ]
        }
      };
    }
    return {
      statusCode: 200,
      body: {
        success: true,
        message: 'File uploaded successfully',
        url: '/extracted_images/p2_img1_1570x1467.jpeg'
      }
    };
  }
  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
};
