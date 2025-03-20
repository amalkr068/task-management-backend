const express = require("express");
const { register, login,getUserProfile,logout } = require("../Controllers/authController");
const { registerSchema, loginSchema } = require("../Validator/authValidator");
const validate = require("../Middleware/validate");
const {authMiddleware} = require("../Middleware/authMiddleware")

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile",authMiddleware, getUserProfile); // Protected route
router.post("/logout",logout)


module.exports = router;
