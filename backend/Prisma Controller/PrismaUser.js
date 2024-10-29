import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const prisma = new PrismaClient();

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user already exists
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firstName: name,
        email: email,
        password: hashedPassword,
        gender: "gender",
        address: "",
        dob: "dob",
        phone: "phone",
        lastName: "lastName",
        cartData: "",
      },
    });

    // Generate token using newUser.id
    const token = createToken(newUser.id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        address: true,
        dob: true,
        phone: true,
      },
    });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { userId, firstName, gender, address, dob, phone } = req.body;
  try {
    // Validate required fields
    if (!userId || !firstName || !phone || !dob || !gender || !address) {
      return res.json({ success: false, message: "Data missing" });
    }

    // Update user profile in Prisma
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        gender,
        address: JSON.parse(address),
        dob,
        phone,
      },
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(user.id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { getUserProfile, loginUser, registerUser, updateUserProfile };
