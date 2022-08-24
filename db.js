const mongoose = require("mongoose");

const connectToMongo = (mongoURI) => {
    return mongoose.connect(mongoURI);
};

module.exports = connectToMongo;
