import express from "express";
import {
  change_Employee_Password,
  delete_Employee,
  employee_Profile,
  get_Single_Employee_Profile,
  getCashierEmailsAndNames,
  getChefDashboardData,
  login_Chef,
  login_InventoryManager,
  logoutEmployee,
  update_Employee_Profile,
} from "../controllers/employeeController.js";
import adminAuth from "../middleware/adminAuth.js";
import empAuth from "../middleware/empAuth.js";

const employeeRoute = express.Router();

employeeRoute.post("/login-chef", login_Chef);
employeeRoute.post("/login-inventory_manager", login_InventoryManager);
employeeRoute.post("/logout-employee", empAuth, logoutEmployee);
//mongos
employeeRoute.get("/profile", empAuth, employee_Profile);
employeeRoute.post("/update-profile", empAuth, update_Employee_Profile);
employeeRoute.get("/employee-profile/:empId", get_Single_Employee_Profile);
employeeRoute.post("/change-password", empAuth, change_Employee_Password);
//for admin
employeeRoute.post("/delete-employee", adminAuth, delete_Employee);

employeeRoute.get("/get-cashier-emails-and-names", getCashierEmailsAndNames);

employeeRoute.get("/chef-dashboard", empAuth, getChefDashboardData);

export default employeeRoute;
