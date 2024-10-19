import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const prisma = new PrismaClient();

// API to ADD Employee
export const addEmployee2 = async (req, res) => {
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

    const imageFile = req.file ? req.file.filename : null;

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

    // // Upload image to Cloudinary
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   resource_type: "image",
    // });
    // const imageUrl = imageUpload.secure_url;

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
        image: imageFile,
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
export const allEmployees2 = async (req, res) => {
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

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login employee
export const loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if employee exists
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
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
