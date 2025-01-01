import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { parsePhoneNumberFromString } from "libphonenumber-js";
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

//get user profile
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

    // Format the phone number for display
    if (userData.phone) {
      const phoneNumber = parsePhoneNumberFromString(userData.phone);
      if (phoneNumber && phoneNumber.isValid()) {
        userData.phone = phoneNumber.formatInternational(); // Format as "+251 963 698 568"
      }
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
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

    // Validate and format phone number
    let formattedPhone = existingUser.phone; // Default to the existing phone
    if (phone) {
      const phoneNumber = parsePhoneNumberFromString(phone, "ET"); // Replace "ET" with your default country code
      if (!phoneNumber || !phoneNumber.isValid()) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
        });
      }
      formattedPhone = phoneNumber.format("E.164");
    }

    // Merge existing data with new data, prioritizing new data
    const updatedData = {
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      email: email || existingUser.email,
      gender: gender || existingUser.gender,
      dob: dob || existingUser.dob,
      phone: formattedPhone,
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

//get all the users
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

    // Format phone numbers for display
    const formattedUsers = users.map((user) => {
      if (user.phone) {
        const phoneNumber = parsePhoneNumberFromString(user.phone);
        if (phoneNumber && phoneNumber.isValid()) {
          user.phone = phoneNumber.formatInternational(); // Format as "+251 963 698 568"
        }
      }
      return user;
    });

    res.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving users",
    });
  }
};

// Get user favorites and customizations
const getUserFavoritesAndCustomizations = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const userIdInt = parseInt(userId);

    // Fetch user's favorite foods
    const favorites = await prisma.favorite.findMany({
      where: { userId: userIdInt, foodId: { not: null, not: 0 } },
      include: { food: true }, // Include related food details
    });

    // Fetch user's customizations
    const customizations = await prisma.customization.findMany({
      where: { userId: userIdInt, foodId: { not: null, not: 0 } },
      include: { food: true }, // Include related food details
    });

    // Fetch user's ratings
    const ratings = await prisma.rating.findMany({
      where: { userId: userIdInt, foodId: { not: null, not: 0 } },
      include: { food: true }, // Include related food details
    });

    // Map and organize the data
    res.json({
      success: true,
      message:
        "Fetched user favorites, customizations, and ratings successfully",
      data: {
        favorites: favorites.map((favorite) => ({
          foodId: favorite.foodId,
          foodName: favorite.food.name,
          foodCategory: favorite.food.category,
          foodPrice: favorite.food.price,
          foodImage: favorite.food.image,
        })),
        customizations: customizations.map((customization) => ({
          foodId: customization.foodId,
          foodName: customization.food.name,
          customNote: customization.customNote,
        })),
        ratings: ratings.map((rating) => ({
          foodId: rating.foodId,
          foodName: rating.food.name,
          userRating: rating.rating,
        })),
      },
    });
  } catch (error) {
    console.error(
      "Error fetching favorites, customizations, and ratings:",
      error
    );
    res.json({
      success: false,
      message: "Error fetching favorites, customizations, and ratings",
    });
  }
};

// Get user drink favorites, customizations, and ratings
const getUserDrinkDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate input
    if (!userId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const userIdInt = parseInt(userId);

    // Fetch user's favorite drinks
    const favoriteDrinks = await prisma.favorite.findMany({
      where: { userId: userIdInt, drinkId: { not: null } }, // Exclude null drinkDrink_Id
      include: { Drink: true }, // Include related drink details
    });

    // Fetch user's customizations for drinks
    const drinkCustomizations = await prisma.customization.findMany({
      where: { userId: userIdInt, drinkId: { not: null } }, // Exclude null drinkDrink_Id
      include: { Drink: true }, // Include related drink details
    });

    // Fetch user's ratings for drinks
    const drinkRatings = await prisma.rating.findMany({
      where: { userId: userIdInt, drinkId: { not: null } }, // Exclude null drinkId
      include: { Drink: true }, // Include related drink details
    });

    // Map and organize the data
    res.json({
      success: true,
      message: "Fetched user drink details successfully",
      data: {
        favorites: favoriteDrinks.map((favorite) => ({
          drinkId: favorite.drinkId,
          drinkName: favorite.Drink.drink_Name,
          drinkDescription: favorite.Drink.drink_Description,
          drinkCategory: favorite.Drink.drink_Category,
          drinkPrice: favorite.Drink.drink_Price,
          drinkImage: favorite.Drink.drink_Image,
          drinkSize: favorite.Drink.drink_Size,
          isAlcoholic: favorite.Drink.is_Alcoholic,
        })),
        customizations: drinkCustomizations.map((customization) => ({
          drinkId: customization.drinkId,
          drinkName: customization.Drink.drink_Name,
          customNote: customization.customNote,
        })),
        ratings: drinkRatings.map((rating) => ({
          drinkId: rating.drinkId,
          drinkName: rating.Drink.drink_Name,
          userRating: rating.rating,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching drink details:", error);
    res.json({
      success: false,
      message: "Error fetching drink details",
    });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

// Password recovery function
const passwordRecovery = async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a unique confirmation token
    const token = crypto.randomBytes(16).toString("hex");

    // Calculate the token expiry time (e.g., 1 hour from now)
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);

    // Update user with the reset token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: token,
        passwordResetTokenExpiry: tokenExpiry,
      },
    });

    // Generate the confirmation URL
    const confirmationUrl = `http://localhost:5174/lost_password?confirm=${token}`;

    // Set up the email transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your preferred email service
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Recovery",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h1>Password Recovery</h1>
          <p>Hello,</p>
          <p>Click the link below to reset your password:</p>
          <a href="${confirmationUrl}" style="color: #4A90E2;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password recovery email sent. Check your inbox.",
    });
  } catch (error) {
    console.error("Error in passwordRecovery:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

export {
  allUsers,
  changePassword,
  getUserDrinkDetails,
  getUserFavoritesAndCustomizations,
  getUserProfile,
  loginUser,
  passwordRecovery,
  registerUser,
  updateAccountStatus,
  updateUserProfile,
};
