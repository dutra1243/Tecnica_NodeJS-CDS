const express = require('express');
const {body, param} = require('express-validator');
const {validateReq} = require('../middleware/validateReq');

const {addFavoriteMovieToUser, getUserFavoriteMovies} = require('../controllers/userController');


const router = express.Router();

/**
 * @route POST /api/users/addFavorite
 * @description Add a movie to user's favorites list
 * @body {number} movieID - TMDB movie ID to add to favorites
 * @returns {Object} message - Success message
 * @throws {400} - If movieID is invalid or movie is already in favorites
 * @throws {404} - If movie is not found in TMDB
 * @throws {500} - If there's an error fetching from TMDB
 * @requires Authentication
 */
router.post('/addFavorite', [
    body('movieID').isInt({min: 1}).withMessage('movieID must be a positive integer.'),
], validateReq, addFavoriteMovieToUser);

/**
 * @route GET /api/users/favoriteMovies
 * @description Get all favorite movies for the authenticated user
 * @returns {Object[]} Array of favorite movies
 * @returns {Object} message - When no favorites are found
 * @requires Authentication
 */
router.get('/favoriteMovies', getUserFavoriteMovies);


module.exports = router;


