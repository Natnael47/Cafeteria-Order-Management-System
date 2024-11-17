import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// Prisma Client initialization
const prisma = new PrismaClient();

// Stripe gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Global Variables
const currency = "USD";
const delivery_charge = 10;

// Function to display all orders with "Order Placed" status for chef
const displayOrdersForChef = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "Order Placed",
      },
      orderBy: { date: "asc" },
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for chef to accept an order and start preparing it
const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "preparing" },
    });

    res.json({ success: true, message: "Order accepted, preparing" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for chef to mark an order as ready
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "ready" },
    });

    res.json({ success: true, message: "Order ready for delivery" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders on cash on delivery
const PlaceOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD",
        isPaid: false,
        date: new Date(),
        status: "Order Placed", // Set initial status to "Order Placed"
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { cartData: {} },
    });

    res.json({ success: true, message: "Order Placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

// Placing orders using Stripe method
const PlaceOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const newOrder = await prisma.order.create({
      data: {
        userId,
        items,
        address,
        amount,
        paymentMethod: "stripe",
        isPaid: false,
        date: new Date(),
        status: "Order Placed", // Set initial status to "Order Placed"
      },
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: delivery_charge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder.id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Verify Stripe checkout
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await prisma.order.update({
        where: { id: orderId },
        data: { isPaid: true },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { cartData: {} },
      });

      res.json({ success: true, message: "Payment Successful" });
    } else {
      await prisma.order.delete({ where: { id: orderId } });
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Fetch all orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { date: "desc" },
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Fetch user orders for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await prisma.order.findMany({
      where: { userId },
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status for admin
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay method (currently empty)
const PlaceOrderRazorpay = async (req, res) => {
  res.json({
    success: false,
    message: "Razorpay payment integration not implemented yet.",
  });
};

export {
  acceptOrder,
  allOrders,
  completeOrder,
  displayOrdersForChef,
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
};
