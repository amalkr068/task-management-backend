const express = require("express");
const { createTask, getUserTasks, updateTask, deleteTask, assignTask, getAllTasks,getAllUsers,reOrderItems } = require("../Controllers/taskController");
const { authMiddleware, adminMiddleware } = require("../Middleware/authMiddleware");
const validate = require("../Middleware/validate");
const { taskSchema } = require("../Validator/taskValidator");

const router = express.Router();

// User Routes
router.post("/", authMiddleware, validate(taskSchema), createTask);
router.get("/", authMiddleware, getUserTasks);
router.put("/:taskId/status", authMiddleware, updateTask);
router.delete("/:taskId",authMiddleware,deleteTask);

// Update task order
router.put("/reorder", authMiddleware, reOrderItems);

// Admin Routes
router.put("/:taskId/assign", authMiddleware, adminMiddleware, assignTask);
router.get("/all", authMiddleware, adminMiddleware, getAllTasks);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);




module.exports = router;
