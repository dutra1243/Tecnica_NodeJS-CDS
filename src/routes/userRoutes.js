const express = require('express');
const {body, param} = require('express-validator');
const {validateReq} = require('../middleware/validateReq');


const router = express.Router();

// TODO: Implement and import these controller functions and after that document the routes.
router.post('/addFavorite', [
    body('movieID').isInt({min: 1}).withMessage('movieID must be a positive integer.'),
], validateReq, addFavoriteMovieToUser);

router.get('/favoriteMovies', getUserFavoriteMovies);


module.exports = router;


