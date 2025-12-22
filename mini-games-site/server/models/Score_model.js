const mongoose = require("mongoose");

// models/Score_model.js
const scoreSchema = new mongoose.Schema(
  {
    gameKey: { type: String, required: true },
    value: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Score", scoreSchema);
