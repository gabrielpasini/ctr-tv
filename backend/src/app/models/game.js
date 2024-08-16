const mongoose = require("../../database");

const TrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  minimapUrl: {
    type: String,
  },
});

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  coverUrl: {
    type: String,
  },
  tracks: [TrackSchema],
});

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
