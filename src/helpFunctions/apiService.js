const axios = require('axios');
const TMDB_TOKEN = process.env.TMDB_TOKEN;

async function getMovieByID(movieID) {

    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieID}`,
            {
                headers: {
                    'Authorization': `Bearer ${TMDB_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        throw error;
    }

}

async function getMoviesByKeyword(keyword) {

    try {
            const baseURL = 'https://api.themoviedb.org/3';
            const headers = {
                'Authorization': `Bearer ${TMDB_TOKEN}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(
                keyword 
                    ? `${baseURL}/search/movie?query=${encodeURIComponent(keyword)}&page=1` // Search with keyword if provided
                    : `${baseURL}/movie/popular`, // Otherwise get popular movies
                    { headers }
                );
                return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error.message);
            throw error;
        }
    
}


module.exports = { getMovieByID, getMoviesByKeyword };