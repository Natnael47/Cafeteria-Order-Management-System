import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Generic Login Function
const loginEmployee = async (req, res, role) => {
  const { email, password } = req.body;
  try {
    // Check if employee exists with the specified role
    const employee = await prisma.employee.findFirst({
      where: {
        email,
        position: {
          contains: role,
        },
      },
    });

    if (!employee) {
      return res.json({
        success: false,
        message: "User not found", // More specific message for user not found
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password incorrect" }); // Specific message for incorrect password
    }

    // Generate token
    const token = createToken(employee.id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login Chef
export const login_Chef = (req, res) => loginEmployee(req, res, "chef");

// Login Barista
export const login_Barista = (req, res) => loginEmployee(req, res, "barista");
