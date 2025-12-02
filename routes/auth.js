const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

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
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/register', { 
      errors: errors.array(), 
      user: req.body 
    });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }]
    });
    
    if (existingUser) {
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
    
    await user.save();
    req.session.user = user;
    res.redirect('/movies');
  } catch (error) {
    res.render('auth/register', { 
      errors: [{ msg: 'Error creating user' }], 
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
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('auth/login', { 
      errors: errors.array(), 
      user: req.body 
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.render('auth/login', { 
        errors: [{ msg: 'Invalid credentials' }], 
        user: req.body 
      });
    }

    req.session.user = user;
    res.redirect('/movies');
  } catch (error) {
    res.render('auth/login', { 
      errors: [{ msg: 'Login error' }], 
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