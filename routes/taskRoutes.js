const express = require("express");
const { createTask, getUserTasks, updateTask, deleteTask, assignTask, getAllTasks } = require("../Controllers/taskController");
const { authMiddleware, adminMiddleware } = require("../Middleware/authMiddleware");
const validate = require("../Middleware/validate");
const { taskSchema } = require("../Validator/taskValidator");

const router = express.Router();

// User Routes
router.post("/", authMiddleware, validate(taskSchema), createTask);
router.get("/", authMiddleware, getUserTasks);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

// Admin Routes
router.put("/:taskId/assign", authMiddleware, adminMiddleware, assignTask);
router.get("/all", authMiddleware, adminMiddleware, getAllTasks);




module.exports = router;
