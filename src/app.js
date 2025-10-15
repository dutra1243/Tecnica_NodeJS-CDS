const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] == ${req.method} ${req.url}`);
    next();
})


// Test route

app.get('/', (req, res) => {
    res.send('Thi is a movies API (ʘ ͜ʖ ʘ) !!!');
});


// Public routes

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Authentication middleware

const authentication = require('./middleware/authentication');
app.use(authentication)

// Protected routes

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const movieRoutes = require('./routes/movieRoutes');
app.use('/api/movies', movieRoutes);


// Server start

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});