const express = require('express');
const {body, param} = require('express-validator');
const {validateReq} = require('../middleware/validateReq');

const {addFavoriteMovieToUser, getUserFavoriteMovies} = require('../controllers/userController');


const router = express.Router();


router.post('/addFavorite', [
    body('movieID').isInt({min: 1}).withMessage('movieID must be a positive integer.'),
], validateReq, addFavoriteMovieToUser);

router.get('/favoriteMovies', getUserFavoriteMovies);


module.exports = router;


