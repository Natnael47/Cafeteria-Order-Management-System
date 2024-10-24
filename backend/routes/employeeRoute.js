import express from "express";
import {
  login_Barista,
  login_Chef,
} from "../controllers/employeeController.js";

const employeeRoute = express.Router();

employeeRoute.post("/login-chef", login_Chef);
employeeRoute.post("/login-barista", login_Barista);

export default employeeRoute;
