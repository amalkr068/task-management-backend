const express = require("express");
const { getTotalTasks, getTopUsers } = require("../Controllers/reportController");
const { authMiddleware, adminMiddleware } = require("../Middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.get("/total-tasks", authMiddleware, adminMiddleware, getTotalTasks);
router.get("/top-users", authMiddleware, adminMiddleware, getTopUsers);

module.exports = router;
