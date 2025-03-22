const cors = require("cors");

const corsOptions = {
  origin: "melodic-fenglisu-8043ef.netlify.app", // Vite frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = cors(corsOptions);
