const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { phone, password, name, role, age, gender, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({
      phone, password: hashedPassword, name, role, age, gender, address
    });
    res.status(201).json({ message: 'User created, bro!', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Registration crashed, dude.' });
  }
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Bad creds, man.' });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await User.update({ twoFactorCode: code }, { where: { phone } });
  await twilio.messages.create({
    body: `Your Telehealth-TCD 2FA code is ${code}`,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
  res.json({ message: '2FA code sent, bro!' });
});

router.post('/verify-2fa', async (req, res) => {
  const { phone, code } = req.body;
  const user = await User.findOne({ where: { phone, twoFactorCode: code } });
  if (!user) return res.status(401).json({ error: 'Invalid code, dude.' });
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  await User.update({ twoFactorCode: null }, { where: { phone } });
  res.json({ token });
});

module.exports = router;
