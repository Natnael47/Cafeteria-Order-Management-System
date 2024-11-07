import express from "express";
import multer from "multer";
import {
  addEmployee,
  adminDashboard,
  adminLogin,
  allEmployees,
  employee_Profile,
  updateEmployee,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

// FOR ADDING EMPLOYEE AND STORE IMAGE LOCALLY
const storage = multer.diskStorage({
  destination: "uploadsEmp",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const uploadImg = multer({ storage: storage });

// Existing routes
adminRouter.post(
  "/add-employee",
  adminAuth,
  uploadImg.single("image"),
  addEmployee
);
adminRouter.get("/dashboard", adminAuth, adminDashboard);
adminRouter.post("/login", adminLogin);
adminRouter.post("/get-employees", adminAuth, allEmployees);
adminRouter.get("/employee-profile/:empId", adminAuth, employee_Profile);
adminRouter.post("/update-employee", adminAuth, updateEmployee);

export default adminRouter;
