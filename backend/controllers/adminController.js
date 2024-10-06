import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import validator from "validator";
import employeeModel from "../models/employeeModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const adminDashboard = async (req, res) => {
  try {
    const users = await userModel.find({});
    const orders = await orderModel.find({});

    const dashData = {
      users: users.length,
      orders: orders.length,
      latestOrders: orders.reverse().slice(0, 5),
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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

    //checking for all data to add Employee
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

    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // hashing Employee password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const employeeData = {
      firstName,
      lastName,
      gender,
      email,
      image: imageUrl,
      password: hashedPassword,
      phone,
      Position,
      shift,
      education,
      experience,
      salary,
      address: JSON.parse(address),
      about,
      date: Date.now(),
    };

    const newEmployee = new employeeModel(employeeData);
    await newEmployee.save();

    res.json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addEmployee, adminDashboard, adminLogin };
