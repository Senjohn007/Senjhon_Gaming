// server/routes/profileRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("../models/User_model");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// -------- Multer storage for avatars --------
const uploadDir = path.join(__dirname, "..", "uploads", "avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const safeName = req.user._id.toString(); // one avatar per user
    cb(null, safeName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// -------- GET /api/profile/me --------
// returns current user's public profile
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username || null,
      bio: user.bio || "",
      country: user.country || "",
      avatarUrl: user.avatarUrl || null,
      createdAt: user.createdAt,
      online: user.online,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// -------- PUT /api/profile --------
// update basic profile fields (no password here)
router.put("/", requireAuth, async (req, res) => {
  try {
    const { name, username, bio, country } = req.body;

    // check username uniqueness if provided
    if (username) {
      const existing = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    if (typeof name === "string") req.user.name = name;
    if (typeof username === "string") req.user.username = username;
    if (typeof bio === "string") req.user.bio = bio;
    if (typeof country === "string") req.user.country = country;

    await req.user.save();

    res.json({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      username: req.user.username || null,
      bio: req.user.bio || "",
      country: req.user.country || "",
      avatarUrl: req.user.avatarUrl || null,
      createdAt: req.user.createdAt,
      online: req.user.online,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// -------- PUT /api/profile/avatar --------
// upload avatar image
router.put(
  "/avatar",
  requireAuth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // public path that frontend can use
      const relativePath = `/uploads/avatars/${req.file.filename}`;
      req.user.avatarUrl = relativePath;
      await req.user.save();

      res.json({
        avatarUrl: req.user.avatarUrl,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to upload avatar" });
    }
  }
);

module.exports = router;
