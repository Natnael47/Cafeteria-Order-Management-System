import express from "express";
import {
  employee_Profile,
  login_Barista,
  login_Chef,
  update_Employee_Profile,
} from "../controllers/employeeController.js";
import empAuth from "../middleware/empAuth.js";

const employeeRoute = express.Router();

employeeRoute.post("/login-chef", login_Chef);
employeeRoute.post("/login-barista", login_Barista);
//mongos
employeeRoute.get("/profile", empAuth, employee_Profile);
employeeRoute.post("/update-profile", update_Employee_Profile);

export default employeeRoute;
