const Task = require("../Models/Task")

// Create Task (User only)
const createTask = async (req, res) => {

  const { title,description,assignedTo,status } = req.body;
  try {
    const task = await new Task({ title,description,status, assignedTo: req.user.id });
    
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, assignedTo: req.user.id });
    
    if (!task) return res.status(403).json({ message: "Not authorized to delete this task" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// Assign Task (Admin only)
const assignTask = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
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



module.exports = { createTask,getUserTasks,updateTask,deleteTask,assignTask,getAllTasks }