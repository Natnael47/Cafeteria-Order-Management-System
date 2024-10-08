import express from "express";
import {
  addEmployee,
  adminDashboard,
  adminLogin,
  allEmployees,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminAuth, adminDashboard);
adminRouter.post("/login", adminLogin);
adminRouter.post(
  "/add-employee",
  adminAuth,
  upload.single("image"),
  addEmployee
);
adminRouter.post("/all-employees", adminAuth, allEmployees);

export default adminRouter;
