const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

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
  birthDate: {
    type: Date,
  },
  mainCharacter: {
    type: [String],
  },
  favoriteGame: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
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
