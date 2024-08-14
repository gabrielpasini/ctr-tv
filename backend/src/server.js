const boot = require("./service/boot");
const mongoose = require("./database");

mongoose.connect(process.env.MONGO_DB, boot());
