const express = require("express");
const { register, login } = require("../Controllers/authController");
const { registerSchema, loginSchema } = require("../Validator/authValidator");
const validate = require("../Middleware/validate");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
