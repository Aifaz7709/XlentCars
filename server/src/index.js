require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

const app = express();

/* ================= CORS ================= */

// DO NOT add API URLs here. Only frontend origins.
const allowedOrigins = [
  'https://xlentcar.com',
  'https://www.xlentcar.com',
  'https://xlentcar.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server, Postman, Railway health checks
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('🚫 CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔥 THIS IS NON-NEGOTIABLE (preflight fix)
app.options('*', cors());

/* ================= Middleware ================= */

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/* ================= Routes ================= */

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter);

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: '🚗 XlentCar Backend API',
    status: 'running'
  });
});

/* ================= Errors ================= */

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

/* ================= Server ================= */

const PORT = process.env.PORT; // Railway injects this
if (!PORT) {
  console.error('❌ PORT not provided by environment');
  process.exit(1);
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 XlentCar Backend running on port ${PORT}`);
});

/* ================= Shutdown ================= */

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

module.exports = app;
