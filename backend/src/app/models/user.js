const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const OptionSchema = new mongoose.Schema({
  value: {
    type: String,
  },
  label: {
    type: String,
  },
});

const MainCharacterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gameId: {
    type: String,
  },
});

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
  },
  youtubeUrl: {
    type: String,
  },
  twitchUrl: {
    type: String,
  },
  mainCharacters: {
    type: [MainCharacterSchema],
  },
  favoriteGame: {
    type: OptionSchema,
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
  },
  birthDate: {
    type: String,
  },
  profile: ProfileSchema,
});

UserSchema.pre("save", async function (next) {
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
