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

			res.status(201).json({
				
        id:user.id,
				name: user.name,
				email: user.email,
        role:user.role
	
		
			});
    
    } }catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register,login }