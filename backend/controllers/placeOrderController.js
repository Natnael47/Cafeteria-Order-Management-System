import PlaceOrderModel from "../models/placeOrderModel.js";
import userModel from "../models/userModel.js";

//placing orders on cash on delivery
const PlaceOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new PlaceOrderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

//placing orders using stripe method
const PlaceOrderStripe = async (req, res) => {};

//placing orders using Razorpay method
const PlaceOrderRazorpay = async (req, res) => {};

//all orders data for admin panel
const allOrders = async (req, res) => {};

//user order data for frontend
const userOrders = async (req, res) => {};

//update order status for admin
const updateStatus = async (req, res) => {};

export {
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
};
