const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = express();

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

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

// SSL Certificate options - only for local development
let httpsServer;
if (process.env.NODE_ENV !== 'production') {
  const sslOptions = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
  };
  httpsServer = https.createServer(sslOptions, app);
}

const PORT = process.env.PORT || 3000;

// Start server
if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
  });
} else {
  // Local development with HTTPS
  const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
  });
  
  app.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
  });
}
