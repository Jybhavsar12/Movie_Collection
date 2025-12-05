const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
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
    await ensureConnection();
    const movies = await Movie.find()
      .populate('addedBy', 'username')
      .maxTimeMS(10000)
      .exec();
    
    let recommendations = [];
    
    // Get recommendations for logged-in users
    if (req.session.user) {
      try {
        console.log('=== RECOMMENDATIONS DEBUG ===');
        console.log('User logged in:', req.session.user.username);
        console.log('User ID:', req.session.user._id);
        
        // Check total movies in database
        const totalMovies = await Movie.countDocuments();
        console.log('Total movies in database:', totalMovies);
        
        // Check movies by other users
        const otherUsersMovies = await Movie.countDocuments({ addedBy: { $ne: req.session.user._id } });
        console.log('Movies by other users:', otherUsersMovies);
        
        const userMovies = await Movie.find({ addedBy: req.session.user._id });
        console.log('User has', userMovies.length, 'movies');
        
        if (userMovies.length > 0) {
          const userGenres = [...new Set(userMovies.flatMap(movie => movie.genres))];
          console.log('User genres:', userGenres);
          
          // Try the most basic recommendation first - any movie by other users
          recommendations = await Movie.find({
            addedBy: { $ne: req.session.user._id }
          })
          .populate('addedBy', 'username')
          .sort({ rating: -1 })
          .limit(6);
          
          console.log('Basic recommendations (any movie by others):', recommendations.length);
          
          // Log the actual movies found
          if (recommendations.length > 0) {
            console.log('Recommended movies:');
            recommendations.forEach((movie, index) => {
              console.log(`${index + 1}. ${movie.name} (${movie.rating}/10) by ${movie.addedBy.username}`);
            });
          }
        } else {
          console.log('User has no movies, trying to show any movies by others');
          
          // Show any movies by other users
          recommendations = await Movie.find({
            addedBy: { $ne: req.session.user._id }
          })
          .populate('addedBy', 'username')
          .sort({ rating: -1 })
          .limit(6);
          
          console.log('Fallback recommendations:', recommendations.length);
          
          // Log the actual movies found
          if (recommendations.length > 0) {
            console.log('Fallback recommended movies:');
            recommendations.forEach((movie, index) => {
              console.log(`${index + 1}. ${movie.name} (${movie.rating}/10) by ${movie.addedBy.username}`);
            });
          }
        }
        
        console.log('Final recommendations count:', recommendations.length);
        console.log('=== END DEBUG ===');
        
      } catch (recError) {
        console.log('Recommendations error:', recError);
      }
    } else {
      console.log('No user session found');
    }
    
    res.render('movies/index', { movies, recommendations });
  } catch (error) {
    console.error('Movies fetch error:', error);
    if (error.message.includes('timed out')) {
      return res.status(503).send('Database timeout. Please try again.');
    }
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

// Add this route for recommendations
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    // Get user's movies to analyze preferences
    const userMovies = await Movie.find({ addedBy: req.session.user._id }).populate('addedBy');
    
    // Extract user's preferred genres
    const userGenres = [...new Set(userMovies.flatMap(movie => movie.genres))];
    
    // Find movies from other users in similar genres
    const recommendations = await Movie.find({
      addedBy: { $ne: req.session.user._id },
      genres: { $in: userGenres },
      rating: { $gte: 7 } // Only recommend highly rated movies
    })
    .populate('addedBy')
    .sort({ rating: -1 })
    .limit(12);
    
    res.render('movies/recommendations', {
      movies: recommendations,
      userGenres: userGenres,
      pageTitle: 'Recommendations'
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.render('movies/recommendations', {
      movies: [],
      userGenres: [],
      pageTitle: 'Recommendations'
    });
  }
});

module.exports = router;
