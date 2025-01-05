import express from "express";
import multer from "multer";
import {
  addEmployee,
  adminDashboard,
  adminLogin,
  allEmployees,
  change_Admin_Password,
  employee_Profile,
  updateEmployee,
  update_Admin_Profile,
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

const upload = multer({ storage: storage });

// Existing routes
adminRouter.post(
  "/add-employee",
  adminAuth,
  upload.single("image"),
  addEmployee
);
adminRouter.get("/dashboard", adminAuth, adminDashboard);
adminRouter.post("/login", adminLogin);
adminRouter.post("/get-employees", adminAuth, allEmployees);
adminRouter.get("/employee-profile/:empId", adminAuth, employee_Profile);
adminRouter.post(
  "/update-employee",
  adminAuth,
  upload.single("image"),
  updateEmployee
);

adminRouter.post("/change-password", adminAuth, change_Admin_Password);

adminRouter.post(
  "/update-admin-profile",
  adminAuth,
  upload.single("image"),
  update_Admin_Profile
);

export default adminRouter;
