const mongoose = require("mongoose");

const Account = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    required: true,
    type: String,
  },
  type: {
    required: true,
    type: String,
  },
  balance: {
    required: true,
    default: 0,
    type: Number,
  },
  transactions: [
    {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },
      received: {
        required: true,
        type: Boolean,
      },
      amount: {
        required: true,
        type: Number,
      },
      date: {
        type: Date,
        required: true,
      },
      failed: {
        type: Boolean,
        required: true,
      },
    },
  ],
  withdrawls: [
    {
      amount: {
        required: true,
        type: Number,
      },
      date: {
        type: Date,
        required: true,
      },
      failed: {
        type: Boolean,
        required: true,
      },
    },
  ],
  deposits: [
    {
      amount: {
        required: true,
        type: Number,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

Account.index({ user: 1 });

module.exports = mongoose.model("Account", Account);
