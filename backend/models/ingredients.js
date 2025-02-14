const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    group: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    remain:{
        type: Number,
        default: 0
    },
    min: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ingredients', ingredientSchema);