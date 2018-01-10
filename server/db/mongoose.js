const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_WHITE_URI, {
  useMongoClient: true
});

module.exports = { mongoose };
