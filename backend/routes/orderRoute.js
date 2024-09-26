import express from "express";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

//Admin features
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.get("/list", adminAuth, listOrders);

//user features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
