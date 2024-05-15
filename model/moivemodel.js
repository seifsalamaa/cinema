const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    kind: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    Description : {
        type : String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set default value to current date/time
    },

    updatedAt : Date 

})

module.exports = mongoose.model("movie", movieSchema);