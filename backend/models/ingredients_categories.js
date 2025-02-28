const mongoose = require('mongoose');

const ingredientCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('ingredient_categories', ingredientCategorySchema);