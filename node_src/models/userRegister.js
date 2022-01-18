const mongoose = require('../database');
var autoIncrement = require('mongoose-auto-increment');

const UserRegisterSchema =  new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        require: true,  
    },
    birthDate: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    }
});

autoIncrement.initialize(mongoose.connection);
UserRegisterSchema.plugin(autoIncrement.plugin, {
    model: 'UserRegister',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

const UserRegister = mongoose.model('UserRegister', UserRegisterSchema);

module.exports = UserRegister;