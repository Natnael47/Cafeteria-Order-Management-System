import express from "express";
import {
  getEmployeeList,
  getReportsByTimePeriod,
} from "../controllers/report.js";
import adminAuth from "../middleware/adminAuth.js";

const ReportRouter = express.Router();

ReportRouter.post("/admin/reports", adminAuth, getReportsByTimePeriod);
ReportRouter.get("/admin/employees", adminAuth, getEmployeeList);

export default ReportRouter;
