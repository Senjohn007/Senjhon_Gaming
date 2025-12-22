const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//route variables
const scoreRoutes = require("./routes/scoreRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/scores", scoreRoutes);
app.use("/api/auth", authRoutes);


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
