import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log('====================================================');
  console.log('🚀 Weldor Digital API Server is Running!');
  console.log(`📡 API Gateway : http://localhost:${PORT}/api`);
  console.log(`🔗 Vite Dev    : http://localhost:5173/ (proxy → :${PORT})`);
  console.log('====================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Kill the process and retry.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
