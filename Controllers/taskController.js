const Task = require("../Models/Task")
const mongoose = require("mongoose");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
 

  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "admin" } }, // Exclude admins
      select: { id: true, name: true, email: true },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




// Create Task (User only)
const createTask = async (req, res) => {

console.log("req =",req.user)
  const { title,description,assignedTo } = req.body;
 
  try {
    const task = await new Task({ title,description, assignedTo: req.user.id });
    
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};



// Get User-Specific Tasks
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// Update Task (Only Task Creator)
const updateTask = async (req, res) => {

  const { title,status } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, assignedTo: req.user.id },
      {title,status},
      { new: true }
    );

    

    if (!task) return res.status(403).json({ message: "Not authorized to update this task" });
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// Delete Task (Only Task Creator)
const deleteTask = async (req, res) => {

 const taskId = req.params.taskId;

    // Validate taskId before querying
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, assignedTo: req.user.id });
   
    if (!task) return res.status(403).json({ message: "Not authorized to delete this task" });

    res.json({ message: "Task deleted successfully",task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Assign Task (Admin only)
const assignTask = async (req, res) => {
  const taskId = new mongoose.Types.ObjectId(req.params.taskId);
  
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: req.body.assignedTo },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





// Get All Tasks (Admin only)
const getAllTasks = async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


//ordering when draging
const reOrderItems = async (req, res) => {
  const { reorderedTasks } = req.body; // Expecting an array of tasks in new order

  try {
    for (let i = 0; i < reorderedTasks.length; i++) {
      await Task.findByIdAndUpdate(reorderedTasks[i]._id, { position: i });
    }

    res.json({ message: "Task order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating task order", error });
  }
}





module.exports = { createTask,getUserTasks,updateTask,deleteTask,assignTask,getAllTasks,getAllUsers,reOrderItems }