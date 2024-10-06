import express from "express";
import { chefDashboard } from "../controllers/chefController.js";
import chefAuth from "../middleware/chefAuth.js";

const chefRouter = express.Router();

chefRouter.get("/chef-dashboard", chefAuth, chefDashboard);

export default chefRouter;
