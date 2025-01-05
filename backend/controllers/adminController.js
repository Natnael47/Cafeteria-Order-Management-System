import bcrypt from "bcryptjs";
import fs from "fs";
import jwt from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import validator from "validator";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Admin Dashboard Elements like (number of users, number of employees, total orders, latest orders)
const adminDashboard = async (req, res) => {
  try {
    // Fetch the total count of users, employees, orders, and foods, along with additional metrics
    const [
      usersCount,
      employeesCount,
      ordersCount,
      foodsCount,
      latestOrders,
      topSellingItems,
      recentFeedback,
      averageUserRating,
      returningUsersCount,
      totalOrdersWithReturnUsers,
      totalPreparationTime,
      completedOrdersCount,
      successfulPaymentsCount,
      totalEmployeeTasks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.employee.count(),
      prisma.order.count(),
      prisma.food.count(),
      prisma.order.findMany({
        orderBy: { date: "desc" },
        take: 5, // Get the latest 5 orders
      }),
      prisma.orderItem.groupBy({
        by: ["foodId"],
        _count: { foodId: true },
        orderBy: { _count: { foodId: "desc" } },
        take: 5, // Top 5 selling items
      }),
      prisma.feedback.findMany({
        orderBy: { date: "desc" },
        take: 5, // Recent 5 feedback
      }),
      prisma.feedback.aggregate({
        _avg: { rating: true }, // Calculate average rating
      }),
      prisma.user.count({
        where: {
          order: {
            some: {}, // Users with at least one order
          },
        },
      }),
      prisma.order.count(), // Total orders for retention calculation
      prisma.order.aggregate({
        _sum: { totalPrepTime: true }, // Sum of preparation times
      }),
      prisma.order.count({
        where: { status: "Completed" }, // Completed orders count
      }),
      prisma.payment.count({
        where: { status: "Successful" }, // Successful payments count
      }),
      prisma.inventoryrequest.count(), // Total tasks handled by employees (example metric)
    ]);

    // Calculate KPIs
    const customerRetentionRate = (
      (returningUsersCount / usersCount) *
      100
    ).toFixed(2);
    const averageFulfillmentTime = (
      totalPreparationTime._sum.totalPrepTime / completedOrdersCount
    ).toFixed(2);
    const paymentCompletionRate = (
      (successfulPaymentsCount / ordersCount) *
      100
    ).toFixed(2);
    const employeeEfficiency = (totalEmployeeTasks / employeesCount).toFixed(2);

    const dashData = {
      users: usersCount,
      employees: employeesCount,
      totalOrders: ordersCount,
      totalFoods: foodsCount,
      latestOrders: latestOrders,
      topSellingItems: topSellingItems,
      recentFeedback: recentFeedback,
      averageUserRating: averageUserRating._avg.rating || 0,
      kpis: {
        customerRetentionRate: `${customerRetentionRate}%`,
        averageFulfillmentTime: `${averageFulfillmentTime} mins`,
        paymentCompletionRate: `${paymentCompletionRate}%`,
        employeeEfficiency: `${employeeEfficiency} tasks/employee`,
      },
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
    res.json({ success: false, message: error.message });
  }
};

const initializeAdminAccount = async () => {
  try {
    // Check if an admin account already exists
    const existingAdmin = await prisma.employee.findFirst({
      where: { position: "admin" },
    });

    if (existingAdmin) {
      console.log("Admin account already exists. Initialization skipped.");
      return { success: false, message: "Admin account already exists." };
    }

    // Admin account details
    const adminEmail = "admin@coms.com";
    const adminPassword = "1q2w3e4r";

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create the admin account
    const newAdmin = await prisma.employee.create({
      data: {
        firstName: "Admin",
        lastName: "admin",
        gender: "Other",
        email: adminEmail,
        password: hashedPassword,
        image: "N/A", // No profile image
        phone: "N/A", // Admin phone not needed
        position: "admin", // Role is set to admin
        shift: "N/A",
        education: "N/A",
        experience: "N/A",
        salary: 0, // No salary for admin
        address: {}, // Empty JSON
        about: "System administrator",
        date: new Date(),
      },
    });

    console.log("Admin account created successfully:", newAdmin);
    return { success: true, message: "Admin account created successfully." };
  } catch (error) {
    console.error("Error initializing admin account:", error);
    return { success: false, message: error.message };
  }
};

// Call the function to initialize the admin account
initializeAdminAccount();

// API for Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the admin employee by email and check if position is 'admin'
    const admin = await prisma.employee.findFirst({
      where: {
        email,
        position: "admin",
      },
    });

    if (!admin) {
      return res.json({ success: false, message: "Admin account not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password incorrect" });
    }

    // Generate token using the admin's employee ID
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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

    // Validate and format phone number
    const parsedPhoneNumber = parsePhoneNumberFromString(phone, "ET"); // Replace "ET" with the country code
    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      return res.json({ success: false, message: "Invalid phone number" });
    }
    const formattedPhone = parsedPhoneNumber.format("E.164"); // Save in E.164 format

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
        phone: formattedPhone,
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
    if (req.file) {
      fs.unlink(`uploadsEmp/${req.file.filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.json({ success: false, message: error.message });
  }
};

// API to get All Employee list for Admin (excluding admin role)
const allEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        position: {
          not: "admin", // Exclude employees with the 'admin' role
        },
      },
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

    // Format phone numbers for display
    const formattedEmployees = employees.map((employee) => {
      if (employee.phone) {
        const phoneNumber = parsePhoneNumberFromString(employee.phone);
        if (phoneNumber && phoneNumber.isValid()) {
          employee.phone = phoneNumber.formatInternational(); // e.g., "+251 963 698 568"
        }
      }
      return employee;
    });

    res.json({ success: true, employees: formattedEmployees });
  } catch (error) {
    console.log("Error retrieving employees:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get employee profile by employeeId from URL
const employee_Profile = async (req, res) => {
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

    // Format the phone number for display
    if (employeeProfile.phone) {
      const phoneNumber = parsePhoneNumberFromString(employeeProfile.phone);
      if (phoneNumber && phoneNumber.isValid()) {
        employeeProfile.phone = phoneNumber.formatInternational(); // e.g., "+251 963 698 568"
      }
    }

    // Respond with success and employee data
    res.json({ success: true, employeeProfile });
  } catch (error) {
    console.log("Error fetching employee profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to Update Employee data
const updateEmployee = async (req, res) => {
  try {
    const employeeId = parseInt(req.body.id, 10);
    if (isNaN(employeeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    // Find the existing employee record
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!existingEmployee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Handle image update and deletion
    let imageFilename = existingEmployee.image; // Keep the current image by default
    if (req.file) {
      try {
        // If a new image is uploaded, delete the old one
        if (existingEmployee.image) {
          fs.unlink(`uploadsEmp/${existingEmployee.image}`, (err) => {
            if (err) {
              console.error("Error deleting old image:", err);
            } else {
              console.log("Old image is deleted successfully");
            }
          });
        }
        imageFilename = req.file.filename; // New image filename
      } catch (fsErr) {
        console.error("Error handling file operations:", fsErr);
      }
    }

    // Parse address safely (with error handling)
    let parsedAddress;
    try {
      parsedAddress = req.body.address
        ? JSON.parse(req.body.address) // Convert address string to an object
        : existingEmployee.address; // Keep the old address if not provided
    } catch (parseErr) {
      console.error("Error parsing address:", parseErr);
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    let updatedPhone = req.body.phone || existingEmployee.phone;

    if (updatedPhone) {
      const parsedPhone = parsePhoneNumberFromString(updatedPhone, "ET"); // Replace "ET" with the default country code
      if (!parsedPhone || !parsedPhone.isValid()) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid phone number" });
      }
      updatedPhone = parsedPhone.format("E.164"); // Save in E.164 format
    }

    // Update employee data
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: req.body.firstName || existingEmployee.firstName,
        lastName: req.body.lastName || existingEmployee.lastName,
        gender: req.body.gender || existingEmployee.gender,
        email: req.body.email || existingEmployee.email,
        phone: updatedPhone,
        position: req.body.position || existingEmployee.position,
        shift: req.body.shift || existingEmployee.shift,
        education: req.body.education || existingEmployee.education,
        experience: req.body.experience || existingEmployee.experience,
        salary: req.body.salary
          ? parseFloat(req.body.salary)
          : existingEmployee.salary,
        address: parsedAddress,
        about: req.body.about || existingEmployee.about,
        image: imageFilename, // Update image filename
      },
    });

    res.json({
      success: true,
      message: "Employee updated",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    if (req.file) {
      fs.unlink(`uploadsEmp/${req.file.filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const change_Admin_Password = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Both old and new passwords are required",
    });
  }

  try {
    // Fetch the admin ID from the decoded token
    const adminId = req.adminId;

    if (!adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not authorized" });
    }

    // Find the admin by ID
    const admin = await prisma.employee.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.position !== "admin") {
      return res
        .status(404)
        .json({ success: false, message: "Admin account not found" });
    }

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the admin's password
    await prisma.employee.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const update_Admin_Profile = async (req, res) => {
  try {
    const { updatedData } = req.body;

    // Ensure that the updated data is provided
    if (!updatedData) {
      return res.status(400).json({
        success: false,
        message: "Updated data is required",
      });
    }

    // Fetch the admin ID from the decoded token
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin not authorized",
      });
    }

    // Find the admin by ID
    const admin = await prisma.employee.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.position !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Update the admin's profile
    const updatedProfile = await prisma.employee.update({
      where: { id: adminId },
      data: updatedData,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Backend: Get Admin Profile
export const get_Admin_Profile = async (req, res) => {
  try {
    // Fetch the admin ID from the decoded token
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin not authorized",
      });
    }

    // Find the admin by ID
    const admin = await prisma.employee.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.position !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    // Format the phone number for display
    if (admin.phone) {
      const phoneNumber = parsePhoneNumberFromString(admin.phone);
      if (phoneNumber && phoneNumber.isValid()) {
        admin.phone = phoneNumber.formatInternational(); // Format as "+251 963 698 568"
      }
    }

    // Return the admin data
    res.json({
      success: true,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        position: admin.position,
        image: admin.image,
        about: admin.about,
        address: admin.address,
        date: admin.date,
      },
    });
  } catch (error) {
    console.log("Error retrieving admin profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  addEmployee,
  adminDashboard,
  adminLogin,
  allEmployees,
  employee_Profile,
  updateEmployee,
};
