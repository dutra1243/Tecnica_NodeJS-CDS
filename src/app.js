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


// TODO: Implement and import routes


app.get('/', (req, res) => {
    res.send('Thi is a movies API (ʘ ͜ʖ ʘ) !!!');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});