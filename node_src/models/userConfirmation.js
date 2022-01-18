const mongoose = require('../database');

const UserConfirmationSchema =  new mongoose.Schema({
    name: {
        type: String,
        require: true,  
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const UserConfirmation = mongoose.model('UserConfirmation', UserConfirmationSchema);

module.exports = UserConfirmation;