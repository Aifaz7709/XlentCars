const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

dotenv.config();
const app = express();

// ========== CORS CONFIG ==========
const allowedOrigins = [
  'https://www.xlentcar.com',
  'https://xlentcar.com',
  'https://xlentcar.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile, curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('🚫 Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ========== MIDDLEWARE ==========
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb' }));
app.use(express.urlencoded({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb', extended: true }));

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter);

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: '🚗 XlentCar Backend API', version: '1.0.0', health: '/api/ping' });
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 XlentCar Backend running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => console.log('HTTP server closed'));
});

module.exports = app;
