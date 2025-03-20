const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
