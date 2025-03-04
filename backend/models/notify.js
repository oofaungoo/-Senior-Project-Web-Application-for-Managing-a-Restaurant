const mongoose = require('mongoose');

const notifySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: ''
    },
    info:{
        type: String,
        default:'',
    }
});

module.exports = mongoose.model('notify', notifySchema);