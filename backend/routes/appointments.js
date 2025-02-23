const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.get('/queue', authMiddleware, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ error: 'Not a patient.' });
  const doctors = await User.findAll({ where: { role: 'doctor', isVerified: true } });
  res.json(doctors.map(d => ({ id: d.id, name: d.name, available: d.isVerified })));
});

router.post('/book', authMiddleware, async (req, res) => {
  const { doctorId, date } = req.body;
  const appointment = await Appointment.create({
    patientId: req.user.id, doctorId, date
  });
  res.status(201).json(appointment);
});

router.put('/manage/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ error: 'Not a doctor.' });
  const { status, prescription } = req.body;
  await Appointment.update({ status, prescription }, { where: { id: req.params.id, doctorId: req.user.id } });
  res.json({ message: 'Appointment updated, bro!' });
});

module.exports = router;
