import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    let items = await db.get('gallery', []);
    if (!Array.isArray(items)) items = [];

    if (type && type !== 'All') {
      items = items.filter((i) => i && i.type === type);
    }

    if (category && category !== 'All') {
      items = items.filter((i) => i && i.category === category);
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newItem = await db.insert('gallery', req.body);
    res.status(201).json({ success: true, message: 'Media item added', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add media item', error: err.message });
  }
});

// POST bulk upload media items
router.post('/bulk', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.items || []);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No media items provided for bulk upload' });
    }

    const inserted = await db.bulkInsert('gallery', items);

    res.status(201).json({
      success: true,
      message: `Successfully added ${inserted.length} media files to gallery!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    console.error('Bulk gallery import error:', err);
    res.status(500).json({ success: false, message: 'Bulk gallery import failed', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('gallery', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Media item not found' });
    res.json({ success: true, message: 'Media item updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update media item', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('gallery', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Media item not found' });
    res.json({ success: true, message: 'Media item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete media item', error: err.message });
  }
});

export default router;
