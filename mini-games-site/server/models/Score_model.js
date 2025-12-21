const mongoose = require("mongoose");

// models/Score_model.js
const scoreSchema = new mongoose.Schema(
  {
    playerId: { type: String, required: true },
    username: { type: String, required: true },
    gameKey: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Score", scoreSchema);
