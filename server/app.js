import { ensureDbConnected } from './db.js';
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

// Main request dispatcher function (Supports standalone Node.js and Vercel Serverless)
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

  // Ensure Database connection is warm
  try {
    await ensureDbConnected();
  } catch (e) {
    console.warn('DB connect attempt notice:', e?.message);
  }

  const url = req.url || '/';
  const pathname = url.split('?')[0];
  const query = req.query || parseQuery(url);
  const method = req.method;

  // Path parts normalization: always ['api', module, subRoute, ...]
  const rawParts = pathname.split('/').filter(Boolean);
  const pathParts = (rawParts[0] === 'api') ? rawParts : ['api', ...rawParts];
  const module = pathParts[1] || '';

  // Read request body safely across Vercel serverless and raw Node HTTP
  let body = {};
  let rawBuffer = Buffer.alloc(0);

  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      body = req.body;
      try {
        rawBuffer = Buffer.from(JSON.stringify(req.body));
      } catch (e) {}
    } else if (Buffer.isBuffer(req.body)) {
      rawBuffer = req.body;
      try {
        body = JSON.parse(rawBuffer.toString('utf8'));
      } catch (e) {
        body = { raw: rawBuffer.toString('utf8') };
      }
    } else if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
        rawBuffer = Buffer.from(req.body);
      } catch (e) {
        body = { raw: req.body };
        rawBuffer = Buffer.from(req.body);
      }
    }
  } else if (method === 'POST' || method === 'PUT') {
    try {
      rawBuffer = await Promise.race([
        new Promise((resolve, reject) => {
          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
          req.on('error', reject);
        }),
        new Promise((resolve) => setTimeout(() => resolve(Buffer.alloc(0)), 1500))
      ]);

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

    // Routing by module
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
    } else if (!module || pathname === '/api' || pathname === '/api/' || pathname === '/') {
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

    const statusCode = result.statusCode || 200;
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      res.status(statusCode).json(result.body);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(JSON.stringify(result.body));
    }
  } catch (error) {
    console.error('Server execution error:', error);
    const errorBody = { success: false, message: 'Internal Server Error', error: error?.message || 'Unknown error' };
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      res.status(500).json(errorBody);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(500);
      res.end(JSON.stringify(errorBody));
    }
  }
}
