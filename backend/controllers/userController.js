import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    //generate token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //check if user already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exist" });
    }
    //validating email format & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//API TO GET USER PROFILE DATA
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//API TO UPDATE USER PROFILE DATA
const updateUserProfile = async (req, res) => {
  try {
    const { userId, phone } = req.body;
    const { name, email, gender, address, dob } = req.body;

    // Log the request body for debugging
    console.log("Received data:", req.body);

    // Check if required fields are present
    if (!name || !phone || !gender || !dob || !email || !address) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Ensure email is defined and is a string
    if (typeof email !== "string") {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Ensure the new email isn't already taken by another user
    const emailExists = await userModel.findOne({
      email,
      _id: { $ne: userId },
    });
    if (emailExists) {
      return res.json({
        success: false,
        message: "Email is already in use by another account",
      });
    }

    // Ensure address is parsed correctly (if sent as a string)
    let parsedAddress;
    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch (err) {
      return res.json({ success: false, message: "Invalid address format" });
    }

    // Update user profile
    await userModel.findByIdAndUpdate(userId, {
      name,
      email,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};

export { getUserProfile, loginUser, registerUser, updateUserProfile };
