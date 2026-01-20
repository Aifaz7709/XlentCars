require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

const app = express();

// ================= CORS =================
const allowedOrigins = [
  'https://www.xlentcar.com',
  'https://xlentcar.com',
  'https://xlentcar.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman, curl, mobile
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log('🚫 Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ================= Middleware =================
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb' }));
app.use(express.urlencoded({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb', extended: true }));

// Simple request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ================= Routes =================
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

const requiredEnvs = ['SUPABASE_URL', 'SUPABASE_KEY'];
requiredEnvs.forEach(v => {
  if (!process.env[v]) console.warn(`⚠️ ${v} not set`);
});


const PORT = process.env.PORT || 8000;
console.log('⚡ PORT Railway sees:', process.env.PORT);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 XlentCar Backend running on port ${PORT}`);
});

// ================= Graceful Shutdown =================
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => console.log('HTTP server closed'));
});

// Catch unhandled errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

module.exports = app;
