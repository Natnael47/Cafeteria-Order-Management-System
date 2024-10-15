import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/PrismaUser.js";
import { addEmployee, allEmployees } from "../controllers/prismaAdmin.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const prismaRoute = express.Router();

prismaRoute.post("/register", registerUser);
prismaRoute.post("/login", loginUser);

prismaRoute.get("/get-profile", authUser, getUserProfile);
prismaRoute.post("/update-profile", authUser, updateUserProfile);

//For admin

prismaRoute.post("/get-employees", adminAuth, allEmployees);
prismaRoute.post(
  "/add-employee",
  adminAuth,
  upload.single("image"),
  addEmployee
);

export default prismaRoute;
