const mongoose = require("../../database");

const AdminsSchema = new mongoose.Schema({
  admins: [String],
});

const Admins = mongoose.model("Admins", AdminsSchema);

module.exports = Admins;
