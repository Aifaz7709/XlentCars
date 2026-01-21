require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

const app = express();

/* =========================
   CORS CONFIG (FINAL)
   ========================= */

// ONLY frontend origins. Never API URLs.
const allowedOrigins = [
  'https://xlentcar.com',
  'https://www.xlentcar.com',
  'https://xlentcar.vercel.app',
  'http://localhost:3000',
  'xlentcar.vercel.app',
  'xlentcar.com',
  'www.xlentcar.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman, curl, server-to-server, Railway health checks
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('🚫 CORS blocked origin:', origin);
    // Do NOT throw. Let browser block silently.
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// REQUIRED for browser preflight behind Railway / proxies
app.options('*', cors(corsOptions));
/* =========================
   MIDDLEWARE
   ========================= */

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging (you WILL see requests now)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/* =========================
   ROUTES
   ========================= */

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter);

// Health check (must always work)
app.get('/api/ping', (req, res) => {
  res.status(200).json({ ok: true, message: 'Server is running' });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'XlentCar Backend API',
    status: 'running'
  });
});

/* =========================
   ERROR HANDLING
   ========================= */

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler (never crashes server)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

/* =========================
   SERVER
   ========================= */

// Railway injects PORT. Fallback is safe.
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 XlentCar Backend running on port ${PORT}`);
});

/* =========================
   SHUTDOWN SAFETY
   ========================= */

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

module.exports = app;
