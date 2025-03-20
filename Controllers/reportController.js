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
    // Group tasks by assignedTo and count the number of tasks per user
    const topUsers = await Task.aggregate([
      { $group: { _id: "$assignedTo", taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } }, // Sort by task count (highest first)
      { $limit: 3 } // Get top 3 users
    ]);

    // Fetch user details from MySQL using Prisma
    const users = await Promise.all(
      topUsers.map(async (user) => {
        try {
          // Ensure _id is converted to a string
          const userId = user._id.toString(); 

          const userInfo = await prisma.user.findUnique({ 
            where: { id: parseInt(userId) } // Ensure ID matches MySQL format
          });

          if (!userInfo) return null; // Skip if user not found

          return {
            userId: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            taskCount: user.taskCount
          };
        } catch (error) {
          console.error("Error fetching user:", error);
          return null;
        }
      })
    );

    // Remove null users
    const filteredUsers = users.filter(user => user !== null);

    res.json(filteredUsers);
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTotalTasks,getTopUsers }