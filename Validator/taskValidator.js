const { z } = require("zod");

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedTo: z.string().optional(), // Only for admin assigning a task
  status: z.enum(["pending", "in-progress", "completed"]).optional()
});

module.exports = { taskSchema };
