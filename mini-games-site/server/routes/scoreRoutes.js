const express = require("express");
const Score = require("../models/Score_model");

const router = express.Router();

// POST /api/scores
router.post("/", async (req, res) => {
  try {
    const { gameKey, value, userId, username } = req.body;

    if (!gameKey || typeof value !== "number" || !username) {
      return res.status(400).json({ message: "Invalid score data" });
    }

    const score = await Score.create({
      gameKey,
      value,
      userId: userId || null, // allow null for guests
      username,
    });

    res.status(201).json(score);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ message: "Failed to save score" });
  }
});

// GET /api/scores/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { game, limit = 10 } = req.query;

    const query = game ? { gameKey: game } : {};
    const scores = await Score.find(query)
      .sort({ value: -1, createdAt: 1 })
      .limit(Number(limit));

    res.json(scores);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
});

module.exports = router;
