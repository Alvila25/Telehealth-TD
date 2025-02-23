// Load environment variables first
require('dotenv').config();

// Import required modules from your package.json dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Using socket.io correctly
const { Sequelize } = require('sequelize');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Socket.io setup with the HTTP server

// Middleware to parse JSON requests
app.use(express.json());

// Sequelize database setup (replace with your actual DB credentials from .env)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Using 'pg' from your dependencies
    logging: false, // Set to true if you want SQL logs
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connected, bro!'))
  .catch(err => console.error('DB connection failed:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected, yo!');
  socket.on('disconnect', () => {
    console.log('User bounced, peace out!');
  });
  // Add your custom socket events here
});

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Telehealth backend is live, my dude!');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, let’s go!`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    sequelize.close();
    console.log('Server and DB shut down, catch you later!');
  });
});
