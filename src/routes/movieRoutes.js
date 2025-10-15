const express = require('express');
const query = require('express-validator');
const validateReq = require('../middleware/validateReq');

const {searchMovies} = require('../controllers/movieController');


const router = express.Router();

/**
 * @route GET /api/movies/searchMovie
 * @description Search for movies using TMDB API. If no keyword is provided, returns popular movies.
 * @query {string} [keyword] - Optional search term for movie titles
 * @returns {Object[]} Array of movies with suggestion scores
 */
router.get('/searchMovie', [
    query('keyword')
    .optional()
    .isString().withMessage('keyword must be a string.')
    .isLength({min: 1}).withMessage('keyword cannot be empty if provided.')
    .trim()
    .escape()
], validateReq, searchMovies);


module.exports = router;