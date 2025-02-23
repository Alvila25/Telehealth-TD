// Load environment variables
try {
  require('dotenv').config();
  console.log('Dotenv loaded, bro!');
} catch (err) {
  console.error('Dotenv failed:', err);
  process.exit(1);
}

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

// Load routes safely
const loadRoute = (path) => {
  try {
    return require(path);
  } catch (err) {
    console.error(`Failed to load ${path}:`, err);
    return null;
  }
};

const authRoutes = loadRoute('./routes/auth');
const appointmentRoutes = loadRoute('./routes/appointments');
const recordRoutes = loadRoute('./routes/records');
const contentRoutes = loadRoute('./routes/content');

if (authRoutes) app.use('/api/auth', authRoutes);
if (appointmentRoutes) app.use('/api/appointments', appointmentRoutes);
if (recordRoutes) app.use('/api/records', recordRoutes);
if (contentRoutes) app.use('/api/content', contentRoutes);

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
const PORT = process.env.PORT || 3000; // Heroku sets PORT, so this is key
sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server vibin’ on port ${PORT}, let’s go!`));
  })
  .catch(err => {
    console.error('DB sync failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    sequelize.close();
    console.log('Server and DB shut down, catch you later!');
  });
});
