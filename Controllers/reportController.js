const Task = require("../Models/Task");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



// Get Total Tasks Created
 const getTotalTasks = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    res.json({ totalTasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




// Get Top 3 Most Productive Users
 const getTopUsers = async (req, res) => {
  try {
    // Group tasks by assignedTo and count the number of tasks for each user
    const topUsers = await Task.aggregate([
      { $group: { _id: "$assignedTo", taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } }, // Sort by most tasks
      { $limit: 3 } // Get top 3
    ]);

    // Fetch user details from MySQL using Prisma
    const users = await Promise.all(
      topUsers.map(async (user) => {
        const userInfo = await prisma.user.findUnique({ where: { id: parseInt(user._id) } });
        return {
          userId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          taskCount: user.taskCount
        };
      })
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTotalTasks,getTopUsers }