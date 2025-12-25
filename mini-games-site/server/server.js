const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

//route variables
const scoreRoutes = require("./routes/scoreRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: false }));
app.use(express.json());

// serve uploaded avatars statically
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

//routes
app.use("/api/scores", scoreRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
