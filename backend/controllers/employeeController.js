import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import jwt from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";

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
    // Find employee with the given email and role
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
        message: "Employee not found",
      });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Password incorrect" });
    }

    // Create a workLog entry for login
    await prisma.workLog.create({
      data: {
        employeeId: employee.id,
        loginTime: new Date(), // Record current login time
      },
    });

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

// Login Inventory Manager
export const login_InventoryManager = (req, res) =>
  loginEmployee(req, res, "inventory");

// Employee Logout Function
export const logoutEmployee = async (req, res) => {
  try {
    const empId = parseInt(req.body.empId, 10);

    if (!empId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required for logout",
      });
    }

    // Find the latest workLog entry without a logoutTime
    const latestWorkLog = await prisma.workLog.findFirst({
      where: {
        employeeId: empId,
        logoutTime: null,
      },
      orderBy: {
        loginTime: "desc",
      },
    });

    if (!latestWorkLog) {
      return res.status(404).json({
        success: false,
        message: "No active session found for this employee",
      });
    }

    //console.log("Latest workLog found:", latestWorkLog);

    // Update the workLog entry with the current logout time
    try {
      const updatedLog = await prisma.workLog.update({
        where: { id: latestWorkLog.id },
        data: {
          logoutTime: new Date(),
        },
      });

      //console.log("Updated workLog:", updatedLog);
      return res
        .status(200)
        .json({ success: true, message: "Logout successful" });
    } catch (updateError) {
      console.error("Error during update operation:", updateError);
      return res.status(500).json({
        success: false,
        message: "Failed to update logout time",
        error: updateError.message,
      });
    }
  } catch (error) {
    console.error("Error logging out:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API to get employee profile
export const employee_Profile = async (req, res) => {
  const { empId } = req.body; // Fetching empId from the request body

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

    // Format the phone number for display
    if (profileData.phone) {
      const phoneNumber = parsePhoneNumberFromString(profileData.phone);
      if (phoneNumber && phoneNumber.isValid()) {
        profileData.phone = phoneNumber.formatInternational(); // e.g., "+251 963 698 568"
      }
    }

    // Respond with success and employee data
    res.json({ success: true, profileData });
  } catch (error) {
    console.log("Error fetching employee profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to get employee emails and names with position 'cashier'
export const getCashierEmailsAndNames = async (req, res) => {
  try {
    // Fetching employee data with the position 'cashier' from the database using Prisma
    const cashierData = await prisma.employee.findMany({
      where: { position: "cashier" },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    // Check if any cashiers are found
    if (cashierData.length === 0) {
      return res.json({ success: false, message: "No cashiers found" });
    }

    // Respond with success and cashier data
    res.json({ success: true, cashierData });
  } catch (error) {
    console.log("Error fetching cashier data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    //console.log(updatedData);

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

export const change_Employee_Password = async (req, res) => {
  const { empId, oldPassword, newPassword } = req.body;

  if (!empId || !oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Find the employee by ID
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(empId) },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the employee's password
    await prisma.employee.update({
      where: { id: parseInt(empId) },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getChefDashboardData = async (req, res) => {
  try {
    const [
      totalOrdersCount,
      completedOrdersCount,
      pendingOrdersCount,
      topSellingItems,
      totalPreparationTime,
      averagePreparationTime,
      recentFeedback,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "Completed" } }),
      prisma.order.count({ where: { status: "Pending" } }),
      prisma.orderItem.groupBy({
        by: ["foodId"],
        _count: { foodId: true },
        orderBy: { _count: { foodId: "desc" } },
        take: 5,
      }),
      prisma.order.aggregate({ _sum: { totalPrepTime: true } }),
      prisma.order.aggregate({ _avg: { totalPrepTime: true } }),
      prisma.feedback.findMany({
        orderBy: { date: "desc" },
        take: 5,
      }),
    ]);

    const topSellingItemsWithDetails = await Promise.all(
      topSellingItems
        .filter((item) => item.foodId !== null) // Filter out items with null foodId
        .map(async (item) => {
          const foodDetails = await prisma.food.findUnique({
            where: { id: item.foodId },
            select: { name: true, category: true },
          });
          return {
            foodId: item.foodId,
            name: foodDetails?.name || "Unknown",
            category: foodDetails?.category || "Unknown",
            count: item._count.foodId,
          };
        })
    );

    const avgPrepTime = averagePreparationTime._avg.totalPrepTime || 0;

    const dashData = {
      totalOrders: totalOrdersCount,
      completedOrders: completedOrdersCount,
      pendingOrders: pendingOrdersCount,
      topSellingItems: topSellingItemsWithDetails,
      averagePreparationTime: avgPrepTime.toFixed(2),
      recentFeedback: recentFeedback,
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log("Error fetching chef dashboard data:", error);
    res.json({ success: false, message: error.message });
  }
};
