import express from "express";
import {
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
} from "../controllers/placeOrderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const placeOrderRouter = express.Router();

//admin features
placeOrderRouter.post("/list", adminAuth, allOrders);
placeOrderRouter.post("/status", adminAuth, updateStatus);

//payment methods
placeOrderRouter.post("/place", authUser, PlaceOrder);
placeOrderRouter.post("/stripe", authUser, PlaceOrderStripe);
placeOrderRouter.post("/razorpay", authUser, PlaceOrderRazorpay);

//user features
placeOrderRouter.post("/userorders", authUser, userOrders);

export default placeOrderRouter;
