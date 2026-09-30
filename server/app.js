import { handleAuth } from './routes/auth.js';
import { handleProducts } from './routes/products.js';
import { handleCategories, handleBanners, handleGallery, handleExhibitions } from './routes/content.js';
import { handleCrm } from './routes/crm.js';
import { handleHrms } from './routes/hrms.js';
import { handleSettings } from './routes/settings.js';
import { handleUploadRequest } from './routes/upload.js';

// Parse query parameters
const parseQuery = (url) => {
  const query = {};
  const qIdx = url.indexOf('?');
  if (qIdx === -1) return query;
  const qStr = url.substring(qIdx + 1);
  const pairs = qStr.split('&');
  for (const pair of pairs) {
    const [k, v] = pair.split('=');
    if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
  }
  return query;
};

// Main request dispatcher function
export default async function app(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || '/';
  const pathname = url.split('?')[0];
  const query = parseQuery(url);
  const method = req.method;

  // Path parts: ['', 'api', 'products', ':id']
  const pathParts = pathname.split('/').filter(Boolean);

  // Read request body buffer for POST/PUT
  let body = {};
  let rawBuffer = Buffer.alloc(0);
  if (method === 'POST' || method === 'PUT') {
    try {
      rawBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
      });

      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json') || (!contentType.includes('multipart') && rawBuffer.length > 0)) {
        try {
          body = JSON.parse(rawBuffer.toString('utf8'));
        } catch (e) {
          body = { raw: rawBuffer.toString('utf8') };
        }
      }
    } catch (e) {
      body = {};
    }
  }

  try {
    let result = { statusCode: 404, body: { success: false, message: 'API Route Not Found' } };

    // Routing by prefix
    const module = pathParts[1]; // /api/:module

    if (module === 'auth') {
      result = await handleAuth(req, res, method, pathParts, body);
    } else if (module === 'products') {
      result = await handleProducts(req, res, method, pathParts, body, query);
    } else if (module === 'categories') {
      result = await handleCategories(req, res, method, pathParts, body);
    } else if (module === 'banners') {
      result = await handleBanners(req, res, method, pathParts, body);
    } else if (module === 'gallery') {
      result = await handleGallery(req, res, method, pathParts, body);
    } else if (module === 'exhibitions') {
      result = await handleExhibitions(req, res, method, pathParts, body, query);
    } else if (module === 'crm') {
      result = await handleCrm(req, res, method, pathParts, body, query);
    } else if (module === 'hrms') {
      result = await handleHrms(req, res, method, pathParts, body, query);
    } else if (module === 'settings') {
      result = await handleSettings(req, res, method, pathParts, body);
    } else if (module === 'upload') {
      result = await handleUploadRequest(req, res, method, pathParts, rawBuffer);
    } else if (pathname === '/api' || pathname === '/api/') {
      result = {
        statusCode: 200,
        body: {
          success: true,
          name: 'Weldor Digital API Gateway',
          version: '1.0.0',
          status: 'online',
          modules: ['auth', 'products', 'categories', 'banners', 'gallery', 'exhibitions', 'crm', 'hrms', 'settings', 'upload']
        }
      };
    }

    res.writeHead(result.statusCode || 200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.body));
  } catch (error) {
    console.error('Server execution error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Internal Server Error', error: error.message }));
  }
}
