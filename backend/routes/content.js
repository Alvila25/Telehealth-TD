const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');

router.get('/edu', authMiddleware, async (req, res) => {
  const content = await Content.findAll();
  res.json(content);
});

router.post('/edu', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Not an admin.' });
  const { title, body, language } = req.body;
  const content = await Content.create({ title, body, language });
  res.status(201).json(content);
});

module.exports = router;
