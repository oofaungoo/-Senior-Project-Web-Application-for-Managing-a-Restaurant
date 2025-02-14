const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   
    username: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    phone_number: {
        type: String,
        default: ''
    },
    role_id: {
        type: String,
        default: ''
    },
});

module.exports = mongoose.model('user', userSchema);