const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: ''
    },
    role_name: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('role', roleSchema);