const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    gameKey: { type: String, required: true },
    value: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
