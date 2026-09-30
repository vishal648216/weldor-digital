import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let banners = await db.get('banners', []);
    if (!Array.isArray(banners)) banners = [];
    const sorted = [...banners].sort((a, b) => ((a && a.displayOrder) || 0) - ((b && b.displayOrder) || 0));
    res.json({ success: true, count: sorted.length, data: sorted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBanner = await db.insert('banners', req.body);
    res.status(201).json({ success: true, message: 'Banner created', data: newBanner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create banner', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('banners', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update banner', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('banners', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete banner', error: err.message });
  }
});

router.post('/reorder', async (req, res) => {
  try {
    const { bannerIds } = req.body;
    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({ success: false, message: 'bannerIds array required' });
    }

    let banners = await db.get('banners', []);
    if (!Array.isArray(banners)) banners = [];
    const updated = banners.map((b) => {
      if (!b) return b;
      const order = bannerIds.indexOf(b.id);
      return order !== -1 ? { ...b, displayOrder: order + 1 } : b;
    });

    await db.set('banners', updated);
    res.json({ success: true, message: 'Banners reordered', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reorder banners', error: err.message });
  }
});

export default router;
