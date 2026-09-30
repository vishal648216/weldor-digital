import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper to evaluate dynamic status based on dates
const resolveExpoStatus = (expo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(expo.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(expo.endDate);
  end.setHours(23, 59, 59, 999);

  const isPassed = today > end;
  const isLive = today >= start && today <= end;

  let computedStatus = expo.status;
  if (isLive) {
    computedStatus = 'Live';
  } else if (isPassed && expo.autoArchivePassedDate !== false) {
    computedStatus = 'Past Exhibition';
  }

  return {
    ...expo,
    isPassed,
    isLive,
    computedStatus,
  };
};

// GET all exhibitions
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let expos = await db.get('exhibitions', []);
    if (!Array.isArray(expos)) expos = [];

    expos = expos.filter(Boolean).map(resolveExpoStatus);

    if (status && status !== 'All') {
      if (status === 'Upcoming') {
        expos = expos.filter((e) => e.computedStatus === 'Upcoming' || e.computedStatus === 'Live');
      } else if (status === 'Past') {
        expos = expos.filter((e) => e.computedStatus === 'Past Exhibition');
      }
    }

    res.json({ success: true, count: expos.length, data: expos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch exhibitions', error: err.message });
  }
});

// GET exhibition by QR slug
router.get('/slug/:slug', async (req, res) => {
  try {
    let expos = await db.get('exhibitions', []);
    if (!Array.isArray(expos)) expos = [];
    const expo = expos.find((e) => e && e.qrSlug === req.params.slug);
    if (!expo) {
      return res.status(404).json({ success: false, message: 'Exhibition QR slug not found' });
    }
    res.json({ success: true, data: resolveExpoStatus(expo) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch exhibition', error: err.message });
  }
});

// POST create exhibition
router.post('/', async (req, res) => {
  try {
    const newExpo = await db.insert('exhibitions', {
      ...req.body,
      qrSlug: req.body.qrSlug || `expo-${Date.now()}`,
      leadsCapturedCount: 0,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json({ success: true, message: 'Exhibition created', data: newExpo });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create exhibition', error: err.message });
  }
});

// PUT update exhibition
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.update('exhibitions', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Exhibition not found' });
    res.json({ success: true, message: 'Exhibition updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update exhibition', error: err.message });
  }
});

// DELETE exhibition
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.delete('exhibitions', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Exhibition not found' });
    res.json({ success: true, message: 'Exhibition deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete exhibition', error: err.message });
  }
});

export default router;
