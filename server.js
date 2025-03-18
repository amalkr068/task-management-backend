require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/reports", reportRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Default Route
app.get("/", (req, res) => {
  res.send("Task Management API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
