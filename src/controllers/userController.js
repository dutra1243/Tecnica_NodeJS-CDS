const axios = require('axios');
const uuid = require('uuid');

const { readFile, writeFile } = require('../helpFunctions/fileHelper');

const TMDB_TOKEN = process.env.TMDB_TOKEN;
const MOVIES_FILE = 'API_DATA/MOVIES.txt';
const FAV_MOVIE_BY_USER_FILE = 'API_DATA/FAV_MOVIE_BY_USER.txt';


async function getUserFavoriteMovies(req, res, next) {

    const userID = req.USER.id;;

    // Read favorite movies by user
    const favorites = readFile(FAV_MOVIE_BY_USER_FILE);
    const userFavorites = favorites.filter(fav => fav.userID === userID);

    // If no favorites found, return an empty array
    if (userFavorites.length === 0) {
        return res.status(200).json({ message: 'No favorite movies found for this user' });
    }


    // Join movies table with favorite movies by user
    const movies = readFile(MOVIES_FILE);
    const favoriteMovies = userFavorites.map(favorite => {
        
        const movie = movies.find(m => m.id === favorite.movieID);
        
        if (!movie) {
            return null;
        }

        // join here and add random suggestion score
        return {
            ...movie,
            addedAt: favorite.addedAt,
            suggestionForTodayScore: Math.floor(Math.random() * 100)
        };

    })
    .filter(movie => movie !== null) // filter out null values
    .sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore); // sort by suggestion score descending

    // Respond with the favorite movies
    res.status(200).json(favoriteMovies);
}


async function addFavoriteMovieToUser(req, res, next) {

    const { movieID } = req.body;
    const userID = req.USER.id;

    // Additional validation
    if (!movieID) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }


    // Fetching movie data from TMDB
    let data;
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
        data = response.data;
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch movie data from TMDB' });
    }

    // Verify that movie data was retrieved
    if (!data || !data.id) {
        return res.status(404).json({ error: 'Movie not found' });
    }


    // Check if the movie is already favorited by the user
    const favorites = readFile(FAV_MOVIE_BY_USER_FILE);
    if (favorites.some(favorite => favorite.movieID === movieID && favorite.userID === userID)) {
        return res.status(400).json({ error: 'Movie is already in favorites' });
    }


    // Add to favorites
    const new_favorite = {
        id: uuid.v4(),
        movieID: data.id,
        userID: userID,
        addedAt: new Date().toISOString(),
    }
    favorites.push(new_favorite);
    writeFile(FAV_MOVIE_BY_USER_FILE, favorites);


    // Ensure the movie exists in the MOVIES_FILE
    const movies = readFile(MOVIES_FILE);
    const movieExists = movies.some(movie => movie.id === data.id);
    if (!movieExists) {
        const new_movie = {
            ...data
        }
        movies.push(new_movie);
        writeFile(MOVIES_FILE, movies);
    }

    // Respond to the client
    res.status(201).json({
        message: 'Movie added to favorites successfully'
    });

}

module.exports = { getUserFavoriteMovies, addFavoriteMovieToUser };