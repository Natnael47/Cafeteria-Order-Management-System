import express from "express";
import { getReportsByTimePeriod } from "../controllers/report.js";
import adminAuth from "../middleware/adminAuth.js";

const ReportRouter = express.Router();

ReportRouter.post("/admin/reports", adminAuth, getReportsByTimePeriod);

export default ReportRouter;
