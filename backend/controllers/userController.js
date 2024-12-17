import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const prisma = new PrismaClient();

const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, password, email, gender, dob, phone, address } =
    req.body;

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

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender: gender || null, // Handle undefined gender
        dob: dob || null, // Handle undefined date of birth
        phone: phone || null, // Handle undefined phone
        address: address
          ? typeof address === "string"
            ? JSON.parse(address)
            : address
          : {}, // Default empty object if address is not provided
      },
    });

    // Generate a token
    const token = createToken(newUser.id);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Error during registration",
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

    // Check if the account status is not active
    if (user.accountStatus === "BANNED") {
      return res.json({
        success: false,
        message: "Your account has been banned.",
      });
    }

    if (user.accountStatus === "DEACTIVATED") {
      return res.json({
        success: false,
        message: "Your account is deactivated.",
      });
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
    console.log("Error in loginUser:", error);
    res.json({ success: false, message: "Error logging in" });
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
    console.log("Error in getUserProfile:", error);
    res.json({ success: false, message: "Error fetching user profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { userId, firstName, lastName, email, gender, address, dob, phone } =
    req.body;

  try {
    // Fetch existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate and check if email is being updated
    if (email && email !== existingUser.email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Check if email is already in use
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Merge existing data with new data, prioritizing new data
    const updatedData = {
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      email: email || existingUser.email, // Update email if provided
      gender: gender || existingUser.gender,
      dob: dob || existingUser.dob,
      phone: phone || existingUser.phone,
      address:
        address !== undefined
          ? typeof address === "string"
            ? JSON.parse(address)
            : address
          : existingUser.address, // Preserve existing address if not provided
    };

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: updatedData,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { password: hashedNewPassword },
    });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing the password",
    });
  }
};

const allUsers = async (req, res) => {
  try {
    // Fetch all users sorted by ID in descending order
    const users = await prisma.user.findMany({
      orderBy: {
        id: "desc", // Sort by ID in descending order
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        dob: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        accountStatus: true,
      },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving users",
    });
  }
};

// Update user account status
const updateAccountStatus = async (req, res) => {
  const { userId, accountStatus } = req.body;

  // Validate accountStatus value
  const validStatuses = ["ACTIVE", "BANNED", "DEACTIVATED"];
  if (!validStatuses.includes(accountStatus)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid account status. Valid options are: ACTIVE, BANNED, DEACTIVATED.",
    });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the account status
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { accountStatus },
    });

    res.json({
      success: true,
      message: `Account status updated to ${accountStatus}`,
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the account status",
    });
  }
};

export {
  allUsers,
  changePassword,
  getUserProfile,
  loginUser,
  registerUser,
  updateAccountStatus,
  updateUserProfile,
};
