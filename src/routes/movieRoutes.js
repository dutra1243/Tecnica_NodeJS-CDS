const express = require('express');
const query = require('express-validator');
const validateReq = require('../middleware/validateReq');


const router = express.Router();

// TODO: implement and import these controller functions and after that document the routes.
router.get('/searchMovie', [
    query('keyword')
    .optional()
    .isString().withMessage('keyword must be a string.')
    .isLength({min: 1}).withMessage('keyword cannot be empty if provided.')
    .trim()
    .escape()
], validateReq, searchMovies);


module.exports = router;