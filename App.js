// Load environment variables
require('dotenv').config();

// Import core modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Sequelize } = require('sequelize');

// Setup app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());

// Database setup
const sequelize = new Sequelize(
  process.env.DATABASE_URL || {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected, bro!'))
  .catch(err => console.error('DB connection failed:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/records', require('./routes/records'));
app.use('/api/content', require('./routes/content'));

// Socket.IO chat
io.on('connection', (socket) => {
  console.log('A user connected, yo!');
  socket.on('join', (room) => socket.join(room));
  socket.on('chat', ({ room, message }) => io.to(room).emit('chat', message));
  socket.on('disconnect', () => console.log('User bounced, peace out!'));
});

// Root route
app.get('/', (req, res) => res.send('Telehealth-TCD Backend is live, my dude!'));

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server vibin’ on port ${PORT}, let’s go!`));
  })
  .catch(err => console.error('DB sync failed:', err));

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    sequelize.close();
    console.log('Server and DB shut down, catch you later!');
  });
});
