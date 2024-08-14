const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

module.exports = mongoose;
