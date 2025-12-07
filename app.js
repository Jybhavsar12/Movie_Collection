const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const app = express();

// Error handling for missing environment variables
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is missing');
}

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET environment variable is missing');
}

// Import database connection
const connectDB = require('./config/database');

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

// Connect to Database
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session middleware - Updated for production
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for now to test
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// Database connection check middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database disconnected, attempting reconnection...');
    try {
      await connectDB();
    } catch (error) {
      console.error('Failed to reconnect to database:', error);
      return res.status(503).send('Database connection unavailable');
    }
  }
  next();
});

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.redirect('/movies');
});

const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
