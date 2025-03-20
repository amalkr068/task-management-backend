require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser")
const { PrismaClient } = require("@prisma/client");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")
const cors = require("./corsConfig"); // Import CORS settings

const app = express();
const prisma = new PrismaClient();




// Middleware
app.use(cors);
app.use(express.json());
app.use(cookieparser())


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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


module.exports = app;