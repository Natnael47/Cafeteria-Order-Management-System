import express from "express";
import { adminDashboard, adminLogin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminAuth, adminDashboard);
adminRouter.post("/login", adminLogin);

export default adminRouter;
