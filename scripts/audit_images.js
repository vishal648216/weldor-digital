import fs from 'fs';
import path from 'path';

const collections = ['products', 'categories', 'banners', 'gallery', 'exhibitions', 'employees', 'settings'];
let totalChecked = 0;
let totalBroken = 0;

for (const col of collections) {
  const filePath = path.join('server/data', col + '.json');
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.trim()) continue;
  const data = JSON.parse(content);
  const items = Array.isArray(data) ? data : [data];

  items.forEach((item, idx) => {
    Object.entries(item).forEach(([k, v]) => {
      if (typeof v === 'string' && (v.endsWith('.jpg') || v.endsWith('.png') || v.endsWith('.jpeg') || v.endsWith('.svg') || v.endsWith('.webp') || k.toLowerCase().includes('image') || k.toLowerCase().includes('avatar') || k.toLowerCase().includes('logo'))) {
        totalChecked++;
        if (v.startsWith('/')) {
          const diskPath = path.join('dist', v.replace(/^\//, ''));
          const publicDiskPath = path.join('public', v.replace(/^\//, ''));
          const exists = fs.existsSync(diskPath) || fs.existsSync(publicDiskPath);
          if (!exists) {
            console.warn(`[MISSING IMAGE] in ${col}[${idx}].${k}: ${v}`);
            totalBroken++;
          }
        }
      } else if (Array.isArray(v) && (k.toLowerCase().includes('gallery') || k.toLowerCase().includes('images'))) {
        v.forEach((imgUrl, i) => {
          totalChecked++;
          if (typeof imgUrl === 'string' && imgUrl.startsWith('/')) {
            const diskPath = path.join('dist', imgUrl.replace(/^\//, ''));
            const publicDiskPath = path.join('public', imgUrl.replace(/^\//, ''));
            const exists = fs.existsSync(diskPath) || fs.existsSync(publicDiskPath);
            if (!exists) {
              console.warn(`[MISSING GALLERY IMAGE] in ${col}[${idx}].${k}[${i}]: ${imgUrl}`);
              totalBroken++;
            }
          }
        });
      }
    });
  });
}

console.log(`\n========================================`);
console.log(`Audited ${totalChecked} image links across entire project database.`);
console.log(`Total broken images: ${totalBroken}`);
console.log(`========================================`);
