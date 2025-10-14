const axios = require('axios');
const uuid = require('uuid');

const { readFile, writeFile } = require('../helpFunctions/fileHelper');

const TMDB_TOKEN = process.env.TMDB_TOKEN;
const MOVIES_FILE = 'API_DATA/MOVIES.txt';
const FAV_MOVIE_BY_USER_FILE = 'API_DATA/FAV_MOVIE_BY_USER.txt';


async function getUserFavoriteMovies(req, res, next) {

    const userID = req.USER.id;;

    const favorites = readFile(FAV_MOVIE_BY_USER_FILE);
    const userFavorites = favorites.filter(fav => fav.userID === userID);

    if (userFavorites.length === 0) {
        return res.status(200).json({ message: 'No favorite movies found for this user' });
    }

    const movies = readFile(MOVIES_FILE);
    const favoriteMovies = userFavorites.map(favorite => {
        
        const movie = movies.find(m => m.id === favorite.movieID);
        
        if (!movie) {
            return null;
        }

        return {
            ...movie,
            addedAt: favorite.addedAt,
            suggestionForTodayScore: Math.floor(Math.random() * 100)
        };

    })
    .filter(movie => movie !== null)
    .sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);

    res.status(200).json(favoriteMovies);
}


async function addFavoriteMovieToUser(req, res, next) {

    const { movieID } = req.body;
    const userID = req.USER.id;

    if (!movieID) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

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
    if (!data || !data.id) {
        return res.status(404).json({ error: 'Movie not found' });
    }


    const favorites = readFile(FAV_MOVIE_BY_USER_FILE);
    if (favorites.some(favorite => favorite.movieID === movieID && favorite.userID === userID)) {
        return res.status(400).json({ error: 'Movie is already in favorites' });
    }


    const new_favorite = {
        id: uuid.v4(),
        movieID: data.id,
        userID: userID,
        addedAt: new Date().toISOString(),
    }
    favorites.push(new_favorite);
    writeFile(FAV_MOVIE_BY_USER_FILE, favorites);


    const movies = readFile(MOVIES_FILE);
    const movieExists = movies.some(movie => movie.id === data.id);
    if (!movieExists) {
        const new_movie = {
            ...data
        }
        movies.push(new_movie);
        writeFile(MOVIES_FILE, movies);
    }
    res.status(201).json({
        message: 'Movie added to favorites successfully'
    });

}

module.exports = { getUserFavoriteMovies, addFavoriteMovieToUser };