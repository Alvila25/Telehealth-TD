const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' }); // Swap to S3 in prod

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { medicalHistory, telehealthData } = req.body;
  await User.update(
    { medicalHistory, telehealthData: telehealthData ? JSON.parse(telehealthData) : null },
    { where: { id: req.user.id } }
  );
  res.json({ message: 'Record uploaded, bro!' });
});

router.get('/patient/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Not a doctor.' });
  const patient = await User.findByPk(req.params.id, { attributes: ['medicalHistory', 'telehealthData'] });
  res.json(patient);
});

module.exports = router;
