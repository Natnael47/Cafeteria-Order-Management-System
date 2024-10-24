import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login Chef
export const login_Chef = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if employee exists with 'chef' in the position
    const employee = await prisma.employee.findFirst({
      where: {
        email,
        position: {
          contains: "chef", // Case-sensitive by default
        },
      },
    });

    if (!employee) {
      return res.json({
        success: false,
        message: "Employee not found or not authorized",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(employee.id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error logging in employee:", error);
    res.json({ success: false, message: error.message });
  }
};

// Login Barista
export const login_Barista = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if barista exists with 'barista' in the position
    const barista = await prisma.employee.findFirst({
      where: {
        email,
        position: {
          contains: "barista", // Check if the position contains 'barista'
        },
      },
    });

    if (!barista) {
      return res.json({
        success: false,
        message: "Barista not found or not authorized",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, barista.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate token
    const token = createToken(barista.id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Error logging in barista:", error);
    res.json({ success: false, message: error.message });
  }
};
