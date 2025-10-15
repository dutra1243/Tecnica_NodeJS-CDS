const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = express();

const movieRoutes = require('../routes/movieRoutes');

jest.mock('axios');


app.use('/api/movies', movieRoutes);

describe('Movie Routes', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('GET /searchMovie', () => {
        it('should return popular movies when no keyword is provided', async () => {
            // Mock the TMDB API response for popular movies
            const mockMovies = {
                data: {
                    results: [
                        { id: 1, title: 'Popular Movie 1' },
                        { id: 2, title: 'Popular Movie 2' }
                    ]
                }
            };
            axios.get.mockResolvedValue(mockMovies);

            const res = await request(app)
                .get('/api/movies/searchMovie')
                .expect('Content-Type', /json/)
                .expect(200);

            // Verify the response structure
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('suggestionScore');
            expect(res.body[1]).toHaveProperty('suggestionScore');

            // Verify axios was called with correct URL
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('/movie/popular'),
                expect.any(Object)
            );
        });

        it('should search movies when keyword is provided', async () => {
            // Mock the TMDB API response for search
            const mockMovies = {
                data: {
                    results: [
                        { id: 1, title: 'Test Movie 1' },
                        { id: 2, title: 'Test Movie 2' }
                    ]
                }
            };
            axios.get.mockResolvedValue(mockMovies);

            const keyword = 'test';
            const res = await request(app)
                .get(`/api/movies/searchMovie?keyword=${keyword}`)
                .expect('Content-Type', /json/)
                .expect(200);

            // Verify the response structure
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('suggestionScore');
            expect(res.body[1]).toHaveProperty('suggestionScore');

            // Verify axios was called with correct URL and keyword
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining(`/search/movie?query=${keyword}`),
                expect.any(Object)
            );
        });

        it('should sort movies by suggestion score', async () => {
            const mockMovies = {
                data: {
                    results: [
                        { id: 1, title: 'Movie 1' },
                        { id: 2, title: 'Movie 2' }
                    ]
                }
            };
            axios.get.mockResolvedValue(mockMovies);

            const res = await request(app)
                .get('/api/movies/searchMovie')
                .expect(200);

            // Verify movies are sorted by suggestionScore in descending order
            expect(res.body[0].suggestionScore).toBeGreaterThanOrEqual(res.body[1].suggestionScore);
        });
    });
});