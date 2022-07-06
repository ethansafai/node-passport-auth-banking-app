const mongoose = require("mongoose");

const User = mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  age: {
    required: true,
    type: Number,
  },
  gender: {
    required: true,
    type: String,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  income: {
    required: true,
    type: Number,
  },
});

module.exports = mongoose.model("User", User);
