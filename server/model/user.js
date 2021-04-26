const mongoose = require("mongoose");
const validator = require("validator");

const User = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    // match: /\D{9}/,
    validate(value) {
      if (value.search(/\D/g) !== -1) {
        throw new Error("id must have only digits!");
      }
      if (value.length !== 9) {
        throw new Error("id must be length of 9");
      }
    },
  },
  name: { type: String, required: true, trim: true, minlength: 5 },
  cash: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error("cash must be a positive number");
    },
    default: 0,
  },
  credit: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error("credit must be a positive number");
    },
    default: 0,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", User);
