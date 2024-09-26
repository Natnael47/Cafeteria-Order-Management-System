import express from "express";
import {
  addTooCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addTooCart);
cartRouter.post("/remove", authUser, removeFromCart);
cartRouter.post("/get", authUser, getCart);

export default cartRouter;
