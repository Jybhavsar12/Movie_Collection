const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const mongoose = require('mongoose');
const router = express.Router();

// Helper function to ensure DB connection
const ensureConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, attempting to reconnect...');
    const connectDB = require('../config/database');
    await connectDB();
  }
};

// GET register form
router.get('/register', (req, res) => {
  res.render('auth/register', { errors: [], user: {} });
});

// POST register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  console.log('=== REGISTRATION ATTEMPT ===');
  console.log('Body:', req.body);
  console.log('Environment:', process.env.NODE_ENV);
  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.render('auth/register', { 
      errors: errors.array(), 
      user: req.body 
    });
  }

  try {
    // Ensure database connection
    await ensureConnection();
    
    console.log('Attempting to register user:', req.body.email);
    
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    }).maxTimeMS(5000).exec();
    
    if (existingUser) {
      console.log('User already exists:', req.body.email);
      return res.render('auth/register', { 
        errors: [{ msg: 'User already exists' }], 
        user: req.body 
      });
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    
    console.log('About to save user...');
    await user.save();
    console.log('User created successfully:', user.email);
    
    req.session.user = user;
    console.log('Session set, redirecting...');
    res.redirect('/movies');
  } catch (error) {
    console.error('Registration error details:', error);
    
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.render('auth/register', { 
        errors: [{ msg: 'Database connection timeout. Please try again.' }], 
        user: req.body 
      });
    }
    
    res.render('auth/register', { 
      errors: [{ msg: 'Error creating user: ' + error.message }], 
      user: req.body 
    });
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('auth/login', { errors: [], user: {} });
});

// POST login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Email:', req.body.email);
  console.log('Password provided:', !!req.body.password);
  
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log('Login validation errors:', errors.array());
    return res.render('auth/login', { 
      errors: errors.array(), 
      user: req.body 
    });
  }

  try {
    // Ensure database connection
    await ensureConnection();
    
    console.log('Looking for user with email:', req.body.email);
    
    // Add timeout to the query
    const user = await User.findOne({ email: req.body.email })
      .maxTimeMS(5000)
      .exec();
    
    if (!user) {
      console.log('User not found:', req.body.email);
      return res.render('auth/login', { 
        errors: [{ msg: 'Invalid credentials' }], 
        user: req.body 
      });
    }
    
    console.log('User found, checking password...');
    const isPasswordValid = await user.comparePassword(req.body.password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', req.body.email);
      return res.render('auth/login', { 
        errors: [{ msg: 'Invalid credentials' }], 
        user: req.body 
      });
    }

    console.log('Login successful, setting session...');
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    };
    console.log('Session data set:', req.session.user);
    res.redirect('/movies');
  } catch (error) {
    console.error('Login error details:', error);
    
    // Handle specific timeout errors
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.render('auth/login', { 
        errors: [{ msg: 'Database connection timeout. Please try again.' }], 
        user: req.body 
      });
    }
    
    res.render('auth/login', { 
      errors: [{ msg: 'Login error: ' + error.message }], 
      user: req.body 
    });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/movies');
});

module.exports = router;
