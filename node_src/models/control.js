const mongoose = require('../database');

const control =  new mongoose.Schema({
    emailMonth: {
        type: String,
        require: true,  
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const controlExp = mongoose.model('control', control);

module.exports = controlExp;