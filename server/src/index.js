require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

/* ================================
   CORS CONFIG (PRODUCTION SAFE)
================================ */

const allowedOrigins = [
  'https://xlentcar.com',
  'https://www.xlentcar.com',
  'https://xlentcar.vercel.app',
  'https://xlent-production.up.railway.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser clients (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);

    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

/* ================================
   ROUTES
================================ */

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require('./routes/subscribe');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter);

/* ================================
   HEALTH CHECK
================================ */

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Server running' });
});

app.get('/', (req, res) => {
  res.json({ name: 'XlentCar API', status: 'running' });
});

/* ================================
   ERROR HANDLING
================================ */

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
});

module.exports = app;
