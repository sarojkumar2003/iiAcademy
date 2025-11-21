// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const inquiryRoutes = require('./routes/inquiryRoutes');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// const protectedRoutes = require('./routes/protectedRoutes'); // optional

const app = express();

/**
 * Optional production middleware (uncomment and install packages)
 *
 * npm install helmet morgan express-rate-limit
 *
 * const helmet = require('helmet');
 * const morgan = require('morgan');
 * const rateLimit = require('express-rate-limit');
 *
 * app.use(helmet());
 * app.use(morgan('combined'));
 *
 * // basic rate limiter
 * const limiter = rateLimit({
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 *   max: 200, // limit each IP to 200 requests per windowMs
 * });
 * app.use(limiter);
 */

// Middleware to parse JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser (useful if you move JWT to httpOnly cookies later)
app.use(cookieParser());

// Configure CORS once. Add origins you trust (Vite default dev origin 5173 included).
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',     // Vite dev server
  'http://localhost:5174',
  'https://iiacademy.in',
  'https://iiacademy-client.onrender.com',
  'https://iiacademy-admin.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies to be sent if using cookies for auth
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/courses', courseRoutes);
// app.use('/api/protected', protectedRoutes); // optional test routes

app.use('/api/inquiries', inquiryRoutes);

// Default Route to check server status
app.get('/', (req, res) => {
  res.send('IIAcademy Backend is running');
});

// Global Error Handling Middleware (keep last)
app.use((err, req, res, next) => {
  console.error('Error stack:', err && err.stack ? err.stack : err);
  // If CORS error, return 400 with message
  if (err && err.message && err.message.startsWith('The CORS policy')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Something went wrong, please try again later.' });
});

// MongoDB Connection with Retry Logic
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/iiacademy';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Establish MongoDB connection
connectDB();

// Start server and graceful shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown on SIGTERM / SIGINT
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
