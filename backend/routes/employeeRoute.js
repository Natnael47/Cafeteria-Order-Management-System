import express from "express";
import { loginEmployee } from "../controllers/employeeController";

const employeeRoute = express.Router();

employeeRoute.post("/login-emp", loginEmployee);

export default employeeRoute;
