const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const recordRoutes = require('./routes/records');
const contentRoutes = require('./routes/content');
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/content', contentRoutes);

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected, bro!');
  socket.on('join', (room) => socket.join(room));
  socket.on('chat', ({ room, message }) => io.to(room).emit('chat', message));
  socket.on('disconnect', () => console.log('User bounced.'));
});

// Root route
app.get('/', (req, res) => res.send('Telehealth-TD Backend is live, dude!'));

// Sync DB and start
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  http.listen(PORT, () => console.log(`Server vibin’ on ${PORT}`));
});
