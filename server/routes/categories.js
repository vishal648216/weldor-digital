import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.get('categories', []);
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: err.message });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  try {
    const categories = await db.get('categories', []);
    const category = categories.find((c) => c && (c.id === req.params.id || c.slug === req.params.id));
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch category', error: err.message });
  }
});

// POST create category
router.post('/', async (req, res) => {
  try {
    const newCategory = await db.insert('categories', req.body);
    res.status(201).json({ success: true, message: 'Category created', data: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: err.message });
  }
});

// POST bulk create categories
router.post('/bulk', async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : (req.body.categories || []);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No categories provided for bulk import' });
    }

    const inserted = await db.bulkInsert('categories', items);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} categories!`,
      count: inserted.length,
      data: inserted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Bulk category import failed', error: err.message });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('categories', req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: err.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('categories', req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: err.message });
  }
});

export default router;
