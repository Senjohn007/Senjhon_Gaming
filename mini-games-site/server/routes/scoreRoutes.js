const express = require("express");
const Score = require("../models/Score_model");

const router = express.Router();

// POST /api/scores  -> save a new score
router.post("/", async (req, res) => {
  try {
    const { playerId, username, gameKey, value } = req.body;

    if (!playerId || !username || !gameKey || typeof value !== "number") {
      return res.status(400).json({ message: "Invalid score data" });
    }

    const score = await Score.create({ playerId, username, gameKey, value });
    res.status(201).json(score);
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/scores/leaderboard?game=snake&limit=10
router.get("/leaderboard", async (req, res) => {
  try {
    const gameKey = req.query.game;
    const limit = parseInt(req.query.limit) || 10;

    if (!gameKey) {
      return res.status(400).json({ message: "game query param is required" });
    }

    const scores = await Score.find({ gameKey })
      .sort({ value: -1, createdAt: 1 })
      .limit(limit);

    res.json(scores);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/my-scores", async (req, res) => {
  try {
    const { playerId, game } = req.query;
    if (!playerId || !game) {
      return res.status(400).json({ message: "playerId and game are required" });
    }

    const scores = await Score.find({ playerId, gameKey: game })
      .sort({ value: -1, createdAt: -1 })
      .limit(10);

    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
