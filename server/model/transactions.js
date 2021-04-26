const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const Transaction = mongoose.Schema({
  sender: { type: String, required: true, ref: "User" },
  receiver: { type: String, required: true, ref: "User" },
  transferAmount: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0)
        throw new Error("transfer amount must be a positive number!");
    },
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", Transaction);
