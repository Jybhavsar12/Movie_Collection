const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const router = express.Router();

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware to check if user owns the movie
const requireOwnership = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    if (movie.addedBy.toString() !== req.session.user._id) {
      return res.status(403).send('Access denied');
    }
    req.movie = movie;
    next();
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().populate('addedBy', 'username');
    res.render('movies/index', { movies });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET add movie form
router.get('/add', requireAuth, (req, res) => {
  res.render('movies/add', { errors: [], movie: {} });
});

// POST add movie
router.post('/add', requireAuth, [
  body('name').notEmpty().withMessage('Movie name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid year required'),
  body('rating').isFloat({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  body('director').notEmpty().withMessage('Director is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('movies/add', { 
      errors: errors.array(), 
      movie: req.body 
    });
  }

  try {
    const genres = Array.isArray(req.body.genres) ? req.body.genres : [req.body.genres];
    
    const movie = new Movie({
      ...req.body,
      genres: genres.filter(g => g),
      addedBy: req.session.user._id
    });
    
    await movie.save();
    res.redirect('/movies');
  } catch (error) {
    res.render('movies/add', { 
      errors: [{ msg: 'Error saving movie' }], 
      movie: req.body 
    });
  }
});

// GET movie details
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('addedBy', 'username');
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.render('movies/show', { movie });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET edit movie form
router.get('/:id/edit', requireAuth, requireOwnership, (req, res) => {
  res.render('movies/edit', { movie: req.movie, errors: [] });
});

// PUT update movie
router.put('/:id', requireAuth, requireOwnership, [
  body('name').notEmpty().withMessage('Movie name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Valid year required'),
  body('rating').isFloat({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  body('director').notEmpty().withMessage('Director is required')
], async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.render('movies/edit', { 
      errors: errors.array(), 
      movie: { ...req.movie.toObject(), ...req.body }
    });
  }

  try {
    const genres = Array.isArray(req.body.genres) ? req.body.genres : [req.body.genres];
    
    await Movie.findByIdAndUpdate(req.params.id, {
      ...req.body,
      genres: genres.filter(g => g)
    });
    
    res.redirect(`/movies/${req.params.id}`);
  } catch (error) {
    res.render('movies/edit', { 
      errors: [{ msg: 'Error updating movie' }], 
      movie: req.body 
    });
  }
});

// DELETE movie
router.delete('/:id', requireAuth, requireOwnership, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// GET movies by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const genre = req.params.genre;
    const movies = await Movie.find({ genres: genre }).populate('addedBy', 'username');
    res.render('movies/index', { 
      movies, 
      pageTitle: `${genre} Movies`,
      currentGenre: genre 
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
