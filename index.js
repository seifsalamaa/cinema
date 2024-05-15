const express = require('express');
const app = express();

// Use express.json() for JSON body parsing
app.use(express.json());

const mongooses = require('./db/db');
const movierouter = require('./routes/movieRoute');

app.use('/api/movie', movierouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});
