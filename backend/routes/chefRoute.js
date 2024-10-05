import express from "express";
import { chefDashboard } from "../controllers/chefController";
import chefAuth from "../middleware/chefAuth";

const chefRouter = express.Router();

chefRouter.get("/chef-dashboard", chefAuth, chefDashboard);

export default chefRouter;
