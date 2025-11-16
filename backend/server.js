// server.js
/**
 * IIAcademy - Express server
 * - Robust CORS (handles deployed frontend origin & localhost dev)
 * - Proper OPTIONS/preflight handling
 * - Safe Mongo connection with retry
 * - Graceful shutdown
 * - Helpful debug logs (remove or reduce in production)
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// const protectedRoutes = require('./routes/protectedRoutes'); // optional

const app = express();

// If behind a proxy (Render, Heroku), trust proxy so secure cookies and IPs work correctly
if (process.env.TRUST_PROXY === 'true' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

/* -------------------- Global middleware -------------------- */

// parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration
 * - Add your allowed production frontends to allowedOrigins
 * - localhostRegex lets any localhost:PORT through (Vite dev uses changing ports)
 * - We explicitly handle OPTIONS preflight and allow non-browser requests (origin undefined)
 */
const allowedOrigins = [
  'https://iiacademy-client.onrender.com', // your deployed frontend
  'https://iiacademy.onrender.com',        // optional if needed
  'https://iiacademy-admin.onrender.com',
  'http://localhost:3000',                 // react dev (CRA)
  'http://localhost:5173',                 // vite dev
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/;

// Lightweight request origin logger (helpful for debugging CORS). Remove or silence in production.
app.use((req, res, next) => {
  if (req.headers && req.headers.origin) {
    console.log('[CORS] incoming origin:', req.headers.origin);
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (curl, Postman) where origin is undefined
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || localhostRegex.test(origin)) {
      return callback(null, true);
    }

    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Ensure OPTIONS preflight is handled for all routes
app.options('*', cors());

/* cookieParser (keep after CORS so cookies are parsed for allowed requests) */
app.use(cookieParser());

/* -------------------- Routes -------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/courses', courseRoutes);
// app.use('/api/protected', protectedRoutes); // optional test routes

// health check
app.get('/', (req, res) => res.send('IIAcademy Backend is running'));

/* -------------------- Error handling -------------------- */
// Global Error Handling Middleware (keep last)
app.use((err, req, res, next) => {
  // Log stack for debugging (consider redacting in production)
  console.error('Error stack:', err && err.stack ? err.stack : err);

  // Friendly CORS error response
  if (err && err.message && err.message.startsWith('The CORS policy')) {
    return res.status(400).json({ message: err.message });
  }

  // Default 500
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong, please try again later.' });
});

/* -------------------- MongoDB connection with retry -------------------- */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/iiacademy';

  // mongoose options recommended
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // other options can be added if needed
  };

  try {
    await mongoose.connect(mongoUri, opts);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err && err.message ? err.message : err);
    // Retry with exponential backoff (capped)
    const retryMs = 5000;
    console.log(`Retrying in ${retryMs/1000}s...`);
    setTimeout(connectDB, retryMs);
  }
};

connectDB();

/* -------------------- Server start & graceful shutdown -------------------- */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
});

const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('HTTP server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

/* Export app for testing if needed */
module.exports = app;
