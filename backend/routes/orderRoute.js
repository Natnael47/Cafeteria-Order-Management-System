import express from "express";
import {
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  acceptOrder,
  allOrders,
  cancelOrder,
  completeOrderItem,
  displayOrdersForChef,
  getOrderItemsForChef,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import empAuth from "../middleware/empAuth.js";
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
orderRouter.post("/complete-item", empAuth, completeOrderItem);
orderRouter.post("/accept", empAuth, acceptOrder);
orderRouter.get("/chef-orders", empAuth, displayOrdersForChef);
orderRouter.post("/order-items", empAuth, getOrderItemsForChef);

export default orderRouter;
