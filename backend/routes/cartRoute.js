import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/authUser.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/remove", authUser, removeFromCart);
cartRouter.post("/get", authUser, getCart);

export default cartRouter;
