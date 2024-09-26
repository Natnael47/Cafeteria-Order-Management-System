import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount += item.price * item.quantity; // Ensure price and quantity are correct
  });
  totalAmount += 2; // Adding delivery charges if applicable
  return totalAmount;
};

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    // Calculate the amount based on the items provided in the request
    const totalAmount = calculateTotalAmount(req.body.items);

    // Create the new order with the calculated amount
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: totalAmount, // Set the correctly calculated amount
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Prepare line items for Stripe
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "USD", // Use the appropriate currency
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Ensure price is in the correct format for Stripe (cents)
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a separate line item
    line_items.push({
      price_data: {
        currency: "USD",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100, // Assuming delivery charge is 2 USD
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Cancelled" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user oreder for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//listing orders for Adimn panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    // Corrected to use req.body.orderId
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

export { listOrders, placeOrder, updateStatus, userOrders, verifyOrder };
