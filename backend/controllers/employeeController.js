import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
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
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password incorrect" });
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
export const login_Barista = (req, res) => loginEmployee(req, res, "baristas");

// API to get employee profile
export const employee_Profile = async (req, res) => {
  const { empId } = req.body; // Fetching empId from the request body
  // console.log("Employee ID:", empId); // Log empId to check its value

  try {
    // Fetching employee data from the database using Prisma
    const profileData = await prisma.employee.findUnique({
      where: { id: empId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        gender: true,
        email: true,
        phone: true,
        position: true,
        shift: true,
        education: true,
        experience: true,
        salary: true,
        address: true,
        about: true,
        date: true,
      },
    });

    // Check if employee data exists
    if (!profileData) {
      return res.json({ success: false, message: "Employee not found" });
    }

    // Respond with success and employee data
    res.json({ success: true, profileData });
    //console.log(employeeData);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// API to update employee profile
export const update_Employee_Profile = async (req, res) => {
  try {
    const { empId, updatedData } = req.body;

    if (!empId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const updatedProfile = await prisma.employee.update({
      where: { id: empId },
      data: updatedData,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to get a single employee profile by ID from the URL
export const get_Single_Employee_Profile = async (req, res) => {
  const { empId } = req.params; // Fetching empId from URL parameters

  if (!empId || isNaN(empId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    // Ensure empId is a number
    const employeeProfile = await prisma.employee.findUnique({
      where: { id: parseInt(empId) }, // Convert empId to an integer
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        gender: true,
        email: true,
        phone: true,
        position: true,
        shift: true,
        education: true,
        experience: true,
        salary: true,
        address: true,
        about: true,
        date: true,
      },
    });

    // Check if employee data exists
    if (!employeeProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Respond with success and employee data
    res.json({ success: true, employeeProfile });
  } catch (error) {
    console.log("Error fetching employee profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to delete employee record
export const delete_Employee = async (req, res) => {
  const { empId } = req.body; // Fetching empId from the request body

  if (!empId || isNaN(empId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Employee ID" });
  }

  try {
    // Find the employee record first to get the image filename
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(empId) }, // Fetch employee by ID
    });

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Delete the employee's image file if it exists
    if (existingEmployee.image) {
      fs.unlink(`uploadsEmp/${existingEmployee.image}`, (err) => {
        if (err) {
          console.error("Error deleting employee image:", err);
        } else {
          console.log("Employee image deleted successfully");
        }
      });
    }

    // Attempt to delete the employee record from the database
    const deletedEmployee = await prisma.employee.delete({
      where: { id: parseInt(empId) }, // Convert empId to an integer
    });

    // If successful, return success response
    res.json({
      success: true,
      message: "Employee record and image deleted successfully",
      deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee record:", error);

    // Handle record not found error
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Handle other internal server errors
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
