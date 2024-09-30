import express from "express";
import { adminDashboard } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard", adminAuth, adminDashboard);

export default adminRouter;
