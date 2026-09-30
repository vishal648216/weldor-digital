const fs = require('fs');
const path = require('path');

const mappings = [
  // Uploads
  {
    src: 'public/extracted_images/p2_img1_1570x1467.jpeg',
    dest: 'public/uploads/products/upload_1790767545782_742320.png'
  },
  {
    src: 'public/extracted_images/p3_img1_1382x1467.jpeg',
    dest: 'public/uploads/products/upload_1790767163241_custom_pneumatic_actuator.png'
  },
  // Products
  {
    src: 'public/extracted_images/p2_img1_1570x1467.jpeg',
    dest: 'public/images/products/pneumatic-cylinders/iso-15552-gallery-1.jpg'
  },
  {
    src: 'public/extracted_images/p3_img1_1382x1467.jpeg',
    dest: 'public/images/products/hydraulic-valves/directional-valve-700bar.jpg'
  },
  {
    src: 'public/extracted_images/p3_img2_660x408.png',
    dest: 'public/images/products/hydraulic-valves/valve-gallery-1.jpg'
  },
  {
    src: 'public/extracted_images/p4_img1_936x710.png',
    dest: 'public/images/products/welding-torches/mig-torch-36kd.jpg'
  },
  {
    src: 'public/extracted_images/p4_img2_660x408.png',
    dest: 'public/images/products/welding-torches/torch-gallery-1.jpg'
  },
  {
    src: 'public/extracted_images/p5_img1_659x408.png',
    dest: 'public/images/products/cnc-components/5axis-manifold-block.jpg'
  },
  {
    src: 'public/extracted_images/p6_img1_936x684.png',
    dest: 'public/images/products/fire-valves/fire-hydrant-valve.jpg'
  },
  // Categories
  {
    src: 'public/extracted_images/p2_img1_1570x1467.jpeg',
    dest: 'public/images/categories/pneumatic-cylinders.jpg'
  },
  {
    src: 'public/extracted_images/p3_img1_1382x1467.jpeg',
    dest: 'public/images/categories/hydraulic-valves.jpg'
  },
  {
    src: 'public/extracted_images/p4_img1_936x710.png',
    dest: 'public/images/categories/robotic-welding-torches.jpg'
  },
  {
    src: 'public/extracted_images/p5_img1_659x408.png',
    dest: 'public/images/categories/cnc-precision-components.jpg'
  },
  {
    src: 'public/extracted_images/p6_img1_936x684.png',
    dest: 'public/images/categories/fire-hydrant-valves.jpg'
  },
  {
    src: 'public/extracted_images/p10_img3_412x413.png',
    dest: 'public/images/categories/robotic-welding-accessories.jpg'
  },
  // Banners
  {
    src: 'public/extracted_images/p4_img1_936x710.png',
    dest: 'public/images/banners/overlay-torch-product.png'
  },
  {
    src: 'public/extracted_images/p10_img3_412x413.png',
    dest: 'public/images/banners/overlay-regulator-product.png'
  },
  // Gallery
  {
    src: 'public/extracted_images/p10_img3_412x413.png',
    dest: 'public/images/gallery/cnc-5axis-machining-bay.jpg'
  },
  {
    src: 'public/extracted_images/p11_img1_2339x1655.png',
    dest: 'public/images/gallery/automated-welding-cell.jpg'
  },
  {
    src: 'public/extracted_images/p12_img1_326x257.png',
    dest: 'public/images/gallery/hydrostatic-test-rig.jpg'
  }
];

mappings.forEach(({ src, dest }) => {
  const fullSrc = path.resolve(src);
  const fullDest = path.resolve(dest);
  
  if (!fs.existsSync(fullSrc)) {
    console.error(`Source not found: ${src}`);
    return;
  }
  
  const destDir = path.dirname(fullDest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(fullSrc, fullDest);
  console.log(`Copied: ${src} -> ${dest}`);
});

console.log('All missing image files created successfully!');
