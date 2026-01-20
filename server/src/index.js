const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const subscribeRouter = require("./routes/subscribe");

dotenv.config();
const app = express();

// ========== CORS CONFIGURATION ==========
const allowedOrigins = [
  'https://www.xlentcar.com',
  'https://xlentcar.com',
  'https://xlentcar.vercel.app', // Vercel preview
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Add local IP detection only in development
if (process.env.NODE_ENV !== 'production') {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  
  const getLocalIp = () => {
    for (const interfaceName of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[interfaceName]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    return 'localhost';
  };

  const localIp = getLocalIp();
  console.log('🌐 Local IP address:', localIp);
  
  // Add local network IPs for development
  allowedOrigins.push(
    `http://${localIp}:3000`,
    /^http:\/\/192\.168\.\d+\.\d+:3000$/,
    /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
    /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:3000$/
  );
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ========== MIDDLEWARE ==========
// Increase JSON body size limit
app.use(express.json({ limit: process.env.EXPRESS_JSON_LIMIT || '25mb' }));
app.use(express.urlencoded({ 
  limit: process.env.EXPRESS_JSON_LIMIT || '25mb', 
  extended: true 
}));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api', subscribeRouter); 

// ========== HEALTH CHECK (REQUIRED FOR RENDER) ==========
app.get('/api/ping', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    service: 'xlentcar-backend'
  });
});

// ========== ROOT ENDPOINT ==========
app.get('/', (req, res) => {
  res.json({ 
    message: '🚗 XlentCar Backend API',
    version: '1.0.0',
    documentation: 'Visit /api/ping for health check',
    endpoints: {
      auth: '/api/auth',
      cars: '/api/cars',
      health: '/api/ping'
    }
  });
});

// ========== ERROR HANDLING ==========
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: ['/api/auth', '/api/cars', '/api/ping']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error',
      message: 'Origin not allowed',
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? ['https://www.xlentcar.com', 'https://xlentcar.com']
        : allowedOrigins.filter(o => typeof o === 'string')
    });
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=========================================
🚀 XlentCar Backend Started!
⚡ Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📅 ${new Date().toISOString()}
=========================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app; // For testing