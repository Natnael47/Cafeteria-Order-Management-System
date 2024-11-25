import express from "express";
import {
  createFeedback,
  getAllFeedback,
} from "../controllers/feedBackController.js";
import authUser from "../middleware/userAuth.js";

const feedBackRoute = express.Router();

feedBackRoute.post("/feedback", authUser, createFeedback);
feedBackRoute.get("/get-feedback", getAllFeedback);

export default feedBackRoute;
