const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookies")

const prisma = new PrismaClient();



const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });

    
    if (user) {
			generateTokenAndSetCookie(user.id, res);

			res.status(201).json({
				
        id:user.id,
				name: user.name,
				email: user.email,
        role:user.role
	
		
			});
    
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
 
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (isMatch) {
			generateTokenAndSetCookie(user.id, res);

			res.status(200).json({
				
        id:user.id,
				name: user.name,
				email: user.email,
        role:user.role
	
		
			});
    
    } }catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }, // Exclude password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//Logout
const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
};


module.exports = { register,login,getUserProfile,logout }