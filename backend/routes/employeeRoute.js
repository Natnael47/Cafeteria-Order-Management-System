import express from "express";
import {
  delete_Employee,
  employee_Profile,
  get_Single_Employee_Profile,
  login_Barista,
  login_Chef,
  update_Employee_Profile,
} from "../controllers/employeeController.js";
import adminAuth from "../middleware/adminAuth.js";
import empAuth from "../middleware/empAuth.js";

const employeeRoute = express.Router();

employeeRoute.post("/login-chef", login_Chef);
employeeRoute.post("/login-barista", login_Barista);
//mongos
employeeRoute.get("/profile", empAuth, employee_Profile);
employeeRoute.post("/update-profile", empAuth, update_Employee_Profile);
employeeRoute.get("/employee-profile/:empId", get_Single_Employee_Profile);
//for admin
employeeRoute.post("/delete-employee", adminAuth, delete_Employee);

export default employeeRoute;
