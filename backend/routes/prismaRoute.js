import express from "express";
import multer from "multer";
import {
  addEmployee2,
  allEmployees2,
  loginEmployee,
} from "../Prisma Controller/EmployeeController.js";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../Prisma Controller/FoodController.js";
import {
  PlaceOrder,
  PlaceOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../Prisma Controller/OrderController.js";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../Prisma Controller/PrismaUser.js";
import { addEmployee, allEmployees } from "../Prisma Controller/prismaAdmin.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const prismaRoute = express.Router();

//FOR USER
prismaRoute.post("/register", registerUser);
prismaRoute.post("/login", loginUser);
prismaRoute.get("/get-profile", authUser, getUserProfile);
prismaRoute.post("/update-profile", authUser, updateUserProfile);

//For ADMIN
prismaRoute.post("/get-employees", adminAuth, allEmployees);
prismaRoute.post(
  "/add-employee",
  upload.single("image"),
  adminAuth,
  addEmployee
);
prismaRoute.post("/login-emp", loginEmployee);

//FOOD ROUTE
//Image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload2 = multer({ storage: storage });

prismaRoute.post("/add-food", adminAuth, upload2.single("image"), addFood);
prismaRoute.get("/list-food", listFood);
prismaRoute.post("/remove-food", adminAuth, removeFood);
prismaRoute.post("/update-food", adminAuth, updateFood);

//FOR ADDING EMPLOYEE AND STORE IMAGE LOCALLY
const storage2 = multer.diskStorage({
  destination: "uploadsEmp",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload3 = multer({ storage: storage2 });

prismaRoute.post("/add-emp", adminAuth, upload3.single("image"), addEmployee2);
prismaRoute.post("/get-emp", adminAuth, allEmployees2);

//Order route
//admin features
prismaRoute.post("/list", adminAuth, allOrders);
prismaRoute.post("/status", adminAuth, updateStatus);

//payment methods
prismaRoute.post("/place", authUser, PlaceOrder);
prismaRoute.post("/stripe", authUser, PlaceOrderStripe);

//user features
prismaRoute.post("/userorders", authUser, userOrders);

//verify payment
prismaRoute.post("/verifyStripe", authUser, verifyStripe);

export default prismaRoute;
