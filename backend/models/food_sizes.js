const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('food_sizes', sizeSchema);