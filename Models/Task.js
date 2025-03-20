const mongoose = require("mongoose");

const TaskSchema =  mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Number, ref: "User" }, // Reference to MySQL user
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    order:{
      type:Number
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports =  Task;
