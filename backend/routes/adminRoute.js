import express from "express";
import multer from "multer";
import {
  addEmployee,
  adminDashboard,
  adminLogin,
  allEmployees,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

//FOR ADDING EMPLOYEE AND STORE IMAGE LOCALLY
const storage = multer.diskStorage({
  destination: "uploadsEmp",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const uploadImg = multer({ storage: storage });

adminRouter.post(
  "/add-employee",
  adminAuth,
  uploadImg.single("image"),
  addEmployee
);

adminRouter.get("/dashboard", adminAuth, adminDashboard);
adminRouter.post("/login", adminLogin);
// adminRouter.post(
//  "/add-employee",
//  adminAuth,
//  upload.single("image"),
//  addEmployee
// );
adminRouter.post("/get-employees", adminAuth, allEmployees);

export default adminRouter;
