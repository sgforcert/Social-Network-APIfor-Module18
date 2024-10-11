const mongoose = require('mongoose');

//connection to socialNetworkCh18 database
mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkCh18');

module.exports = mongoose.connection;
