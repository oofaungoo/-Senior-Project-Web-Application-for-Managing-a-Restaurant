const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    category_id: {
        type: String,
        default: ''
    },
    category:{
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    sizePrices: [
        {
            size: {
                type: String,
                default: ''
            },
            price: {
                type: Number,
                default: 0
            },
            ingredients: [
                {
                    newIngredient: {
                        type: String,
                        default: ''
                    },
                    newIngredientQty: {
                        type: String,
                        default: ''
                    },
                    unit: {
                        type: String,
                        default: ''
                    }
                }
            ]
        }
    ],
    customOptions:[
        {
            label: {
                type: String,
                default: ''
            },
            options: [
                {
                    type: String,
                    default: ''
                }
            ]
        }
    ]
});

module.exports = mongoose.model('food', foodSchema);