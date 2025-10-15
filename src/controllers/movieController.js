const TMDB_TOKEN = process.env.TMDB_TOKEN;
const axios = require('axios');

async function searchMovies(req, res, next) {
    try {

        // Get the keyword from query parameters and sanitize it
        const query = req.query.keyword || '';
        const keyword = query.trim();
        console.log('Keyword:', keyword);

        // Fetch movies from TMDB API
        let response = await getMoviesByKeyword(keyword);

        // Add a random suggestion score to each movie and sort by it
        const addedScore = response.data.results
        .map(movie => ({
            ...movie,
            suggestionScore: Math.floor(Math.random() * 100)
        }))
        .sort((a, b) => b.suggestionScore - a.suggestionScore);


        // Respond with the modified movie list
        res.status(200).json(addedScore);

    } catch (error) {
        console.error('Error fetching movies:', error);
        next(error);
    }
}

module.exports = { searchMovies };