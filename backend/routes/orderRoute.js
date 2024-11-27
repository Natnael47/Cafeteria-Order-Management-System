import express from "express";
import {
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  acceptOrder,
  allOrders,
  cancelOrder,
  completeOrder,
  displayOrdersForChef,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/userAuth.js";

const orderRouter = express.Router();

//admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

//payment methods
orderRouter.post("/place", authUser, PlaceOrder);
orderRouter.post("/stripe", authUser, PlaceOrderStripe);
orderRouter.post("/razorpay", authUser, PlaceOrderRazorpay);
orderRouter.post("/cancel", authUser, cancelOrder);

//user features
orderRouter.post("/user-orders", authUser, userOrders);

//verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

// chef features
orderRouter.post("/complete", completeOrder);
orderRouter.post("/accept", acceptOrder);
orderRouter.get("/chef-orders", displayOrdersForChef);

export default orderRouter;
