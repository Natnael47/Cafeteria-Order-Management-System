import express from "express";
import {
  getEmployeeList,
  getReportsByTimePeriod,
} from "../controllers/report.js";

const ReportRouter = express.Router();

ReportRouter.post("/admin/reports", getReportsByTimePeriod);
ReportRouter.get("/admin/employees", getEmployeeList);

export default ReportRouter;
