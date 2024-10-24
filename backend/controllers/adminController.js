import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import employeeModel from "../models/employeeModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Admin Dashboard Elements like (number of users, number of Employee , latest orders)
const adminDashboard = async (req, res) => {
  try {
    const users = await userModel.find({});
    const orders = await orderModel.find({});
    const employees = await employeeModel.find({});

    const dashData = {
      users: users.length,
      employees: employees.length,
      orders: orders.length,
      latestOrders: orders.reverse().slice(0, 5),
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API to ADD Employee
const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      email,
      password,
      phone,
      Position,
      shift,
      education,
      experience,
      salary,
      address,
      about,
    } = req.body;

    const imageFile = req.file;

    // Checking for all required fields
    if (
      !firstName ||
      !lastName ||
      !gender ||
      !email ||
      !password ||
      !phone ||
      !Position ||
      !shift ||
      !education ||
      !experience ||
      !salary ||
      !address ||
      !about
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Validating password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    //    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //      resource_type: "image",
    //    });
    //
    // const imageUrl = imageUpload.secure_url;

    const imageFilename = req.file ? req.file.filename : null;

    // Parsing the address JSON
    const parsedAddress = JSON.parse(address);

    // Create a new employee using Prisma
    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        gender,
        email,
        password: hashedPassword,
        image: imageFilename,
        phone,
        position: Position,
        shift,
        education,
        experience,
        salary: parseFloat(salary),
        address: parsedAddress,
        about,
        date: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Employee added successfully",
      newEmployee,
    });
  } catch (error) {
    console.log("Error adding employee:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get All Employee list for Admin
const allEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
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
        image: true,
        date: true,
      },
    });
    res.json({ success: true, employees });
  } catch (error) {
    console.log("Error retrieving employees:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addEmployee, adminDashboard, adminLogin, allEmployees };
