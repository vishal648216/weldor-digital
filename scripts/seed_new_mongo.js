import mongoose from 'mongoose';
import { COLLECTION_MODELS } from '../server/models/index.js';
import { SEED_DATA } from '../server/data_bundle.js';

const uri = 'mongodb+srv://weldor_user:Weldor2026@cluster0.fbbdcja.mongodb.net/weldor_industrial?retryWrites=true&w=majority';

async function seed() {
  console.log('Connecting to MongoDB Atlas with weldor_user...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log('🍃 Connected! Seeding all collections...');

  let totalCollections = 0;
  let totalDocs = 0;

  for (const [colName, data] of Object.entries(SEED_DATA)) {
    const model = COLLECTION_MODELS[colName];
    if (!model) continue;

    if (Array.isArray(data)) {
      console.log(`- Seeding ${colName}: ${data.length} records`);
      for (const item of data) {
        const id = item.id || item._id || (`${colName}-${Math.random().toString(36).substr(2, 6)}`);
        await model.findOneAndUpdate(
          { id: id },
          { $set: { ...item, id: id } },
          { upsert: true, returnDocument: 'after' }
        );
        totalDocs++;
      }
      totalCollections++;
    } else if (data && typeof data === 'object') {
      console.log(`- Seeding ${colName}: 1 document`);
      await model.findOneAndUpdate(
        { id: `${colName}-main` },
        { $set: { ...data, id: `${colName}-main` } },
        { upsert: true, returnDocument: 'after' }
      );
      totalDocs++;
      totalCollections++;
    }
  }

  console.log(`\n🎉 Seeded ${totalDocs} documents across ${totalCollections} collections successfully!`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
