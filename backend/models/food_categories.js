const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('food_categories', categorySchema);