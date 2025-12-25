// server/models/User_model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // display name
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    username: { type: String, unique: true, sparse: true }, // gamer tag
    bio: { type: String, maxlength: 200 },
    country: { type: String },
    avatarUrl: { type: String }, // path or URL to avatar image
    online: { type: Boolean, default: false },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("User", userSchema);
