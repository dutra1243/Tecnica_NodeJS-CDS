const express = require('express');
const query = require('express-validator');
const validateReq = require('../middleware/validateReq');

const {searchMovies} = require('../controllers/movieController');


const router = express.Router();

router.get('/searchMovie', [
    query('keyword')
    .optional()
    .isString().withMessage('keyword must be a string.')
    .isLength({min: 1}).withMessage('keyword cannot be empty if provided.')
    .trim()
    .escape()
], validateReq, searchMovies);


module.exports = router;