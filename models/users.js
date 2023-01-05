const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  todo: String,
});

const favoritesSchema = mongoose.Schema({
  favorites: String,
});

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  todo: [todoSchema],
  favorites: [favoritesSchema],
  photo: String,
});

const User = mongoose.model("users", userSchema);
module.exports = User;
