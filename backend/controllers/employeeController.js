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
      return res.status(404).json({
        success: false,
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } not found or not authorized`,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
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
