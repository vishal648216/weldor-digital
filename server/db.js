import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COLLECTION_MODELS } from './models/index.js';
import { SEED_DATA } from './data_bundle.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const findDataDir = () => {
  const dir1 = path.join(__dirname, 'data');
  if (fs.existsSync(dir1)) return dir1;
  const dir2 = path.join(process.cwd(), 'server', 'data');
  if (fs.existsSync(dir2)) return dir2;
  const dir3 = path.join(process.cwd(), 'data');
  if (fs.existsSync(dir3)) return dir3;
  return dir1;
};

const DATA_DIR = findDataDir();

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {}

let isMongoConnected = false;
let mongoConnectingPromise = null;

// Normalize collection name keys
const normalizeKey = (col) => {
  if (col === 'attendance') return 'attendances';
  if (col === 'payroll') return 'payrolls';
  if (col === 'auditLogs' || col === 'audit_logs') return 'auditlogs';
  return col;
};

// Connect to MongoDB Atlas
export const ensureDbConnected = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://weldoradmin:Weldor2026@cluster0.g4wl0mi.mongodb.net/weldor_industrial?retryWrites=true&w=majority';
  if (!uri) return false;
  if (isMongoConnected && mongoose.connection.readyState === 1) return true;
  if (mongoConnectingPromise) return mongoConnectingPromise;

  mongoConnectingPromise = (async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      isMongoConnected = true;
      console.log('🍃 MongoDB Atlas Connected Successfully!');
      return true;
    } catch (err) {
      isMongoConnected = false;
      console.warn('⚠️  MongoDB Connection Notice:', err.message);
      return false;
    } finally {
      mongoConnectingPromise = null;
    }
  })();

  return mongoConnectingPromise;
};

// Initial connection attempt
ensureDbConnected().catch(() => {});

// File read/write helpers
const readFromFile = (collectionName) => {
  const norm = normalizeKey(collectionName);
  const filePath = path.join(DATA_DIR, `${norm}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      if (raw.trim()) return JSON.parse(raw);
    } catch (e) {}
  }
  const directPath = path.join(DATA_DIR, `${collectionName}.json`);
  if (fs.existsSync(directPath)) {
    try {
      const raw = fs.readFileSync(directPath, 'utf8');
      if (raw.trim()) return JSON.parse(raw);
    } catch (e) {}
  }
  // Safe in-memory seed data fallback for serverless
  if (SEED_DATA && SEED_DATA[norm] !== undefined) {
    return JSON.parse(JSON.stringify(SEED_DATA[norm]));
  }
  if (SEED_DATA && SEED_DATA[collectionName] !== undefined) {
    return JSON.parse(JSON.stringify(SEED_DATA[collectionName]));
  }
  return collectionName === 'settings' ? {} : [];
};

const writeToFile = (collectionName, data) => {
  const norm = normalizeKey(collectionName);
  const filePath = path.join(DATA_DIR, `${norm}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
};

// Core getCollection function
export const getCollection = (collectionName) => {
  const norm = normalizeKey(collectionName);
  const model = COLLECTION_MODELS[norm];

  // If MongoDB is connected and we can fetch async in background
  if (isMongoConnected && model) {
    model.find({}).lean().then(docs => {
      if (docs && docs.length > 0) {
        if (norm === 'settings') {
          const doc = docs.find(d => d.id === 'settings-main') || docs[0];
          if (doc) {
            const { _id, __v, ...cleanDoc } = doc;
            writeToFile(collectionName, cleanDoc);
          }
        } else {
          const cleanDocs = docs.map(({ _id, __v, ...rest }) => rest);
          writeToFile(collectionName, cleanDocs);
        }
      }
    }).catch(() => {});
  }

  // Return current persistent memory/file data
  return readFromFile(collectionName);
};

// Async version of getCollection that directly queries MongoDB
export const getCollectionAsync = async (collectionName) => {
  const norm = normalizeKey(collectionName);
  const model = COLLECTION_MODELS[norm];

  if (isMongoConnected && model) {
    try {
      const docs = await model.find({}).lean();
      if (docs && docs.length > 0) {
        if (norm === 'settings') {
          const doc = docs.find(d => d.id === 'settings-main') || docs[0];
          const { _id, __v, ...cleanDoc } = doc;
          writeToFile(collectionName, cleanDoc);
          return cleanDoc;
        }
        const cleanDocs = docs.map(({ _id, __v, ...rest }) => rest);
        writeToFile(collectionName, cleanDocs);
        return cleanDocs;
      }
    } catch (e) {}
  }

  return readFromFile(collectionName);
};

// Core saveCollection function
export const saveCollection = (collectionName, data) => {
  const norm = normalizeKey(collectionName);
  const model = COLLECTION_MODELS[norm];

  // 1. Write to local disk file
  writeToFile(collectionName, data);

  // 2. Persist to MongoDB Atlas
  if (isMongoConnected && model) {
    (async () => {
      try {
        if (Array.isArray(data)) {
          // Sync all items
          const currentIds = new Set();
          for (const item of data) {
            const id = item.id || item._id || `${norm}-${Date.now()}`;
            currentIds.add(id);
            await model.findOneAndUpdate(
              { id: id },
              { $set: { ...item, id: id } },
              { upsert: true, returnDocument: 'after' }
            );
          }
          // Remove deleted items from MongoDB
          if (currentIds.size > 0) {
            await model.deleteMany({ id: { $nin: Array.from(currentIds) } });
          }
        } else if (data && typeof data === 'object') {
          await model.findOneAndUpdate(
            { id: `${norm}-main` },
            { $set: { ...data, id: `${norm}-main` } },
            { upsert: true, returnDocument: 'after' }
          );
        }
      } catch (err) {
        console.warn(`MongoDB sync warning for ${collectionName}:`, err.message);
      }
    })();
  }
};

// Audit logging function
export const logAudit = (action, module, details, user = 'admin') => {
  try {
    const logs = readFromFile('auditlogs');
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      user: typeof user === 'string' ? user : (user?.name || user?.email || 'admin'),
      action,
      module,
      details: typeof details === 'string' ? details : JSON.stringify(details)
    };
    logs.unshift(newLog);
    const trimmed = logs.slice(0, 100);
    saveCollection('auditlogs', trimmed);
  } catch (e) {}
};

// Universal db interface object for route handlers
export const db = {
  get: (col) => getCollection(col),
  getAsync: async (col) => await getCollectionAsync(col),
  getAll: (col) => {
    const d = getCollection(col);
    return Array.isArray(d) ? d : [d];
  },
  set: (col, data) => saveCollection(col, data),
  add: (col, item) => {
    const d = getCollection(col);
    const list = Array.isArray(d) ? d : [];
    const id = item.id || `${col}-${Date.now()}`;
    const newItem = { ...item, id };
    list.unshift(newItem);
    saveCollection(col, list);
    return newItem;
  },
  update: (col, id, updates) => {
    const d = getCollection(col);
    if (Array.isArray(d)) {
      const idx = d.findIndex(item => item.id === id || item._id === id);
      if (idx !== -1) {
        d[idx] = { ...d[idx], ...updates };
        saveCollection(col, d);
        return d[idx];
      }
    } else if (d && typeof d === 'object') {
      const merged = { ...d, ...updates };
      saveCollection(col, merged);
      return merged;
    }
    return null;
  },
  delete: (col, id) => {
    const d = getCollection(col);
    if (Array.isArray(d)) {
      const filtered = d.filter(item => item.id !== id && item._id !== id);
      saveCollection(col, filtered);
      return true;
    }
    return false;
  },
  clearAll: () => {
    for (const [key, Model] of Object.entries(COLLECTION_MODELS)) {
      writeToFile(key, key === 'settings' ? {} : []);
      if (isMongoConnected && Model) {
        Model.deleteMany({}).catch(() => {});
      }
    }
  }
};

export default db;
