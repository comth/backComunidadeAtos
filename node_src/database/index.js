const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:kTNaFbdJ0IE1g0Jl@cluster0-pzwtd.gcp.mongodb.net/test?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
 });
mongoose.Promise = global.Promise;

module.exports = mongoose;