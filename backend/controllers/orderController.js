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
    const { orderId, empId } = req.body; // chefId is passed from the frontend

    // First, update the order's status to 'preparing' and assign the chef
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "preparing",
        chefId: empId, // Set chef ID (cafe ID)
        estimatedCompletionTime: new Date(Date.now() + 60 * 60 * 1000), // Example: adding 1 hour for estimated time
      },
    });

    // Update each orderItem with 'cookingStatus' and 'startedAt'
    await prisma.orderItem.updateMany({
      where: { orderId: orderId },
      data: {
        cookingStatus: "Preparing",
        startedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Order accepted and preparing started",
      data: updatedOrder,
    });
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

    // Validate and calculate the total prepTime from all items in the order
    const totalPrepTimeInMinutes = items.reduce((total, item) => {
      // Make sure prepTime is valid (convert to number if necessary)
      const prepTime = parseInt(item.prepTime, 10);
      return total + (isNaN(prepTime) ? 0 : prepTime); // Sum up prepTimes, default to 0 if invalid
    }, 0);

    // Get the current time (this will be the "start time" for the new order)
    const currentTime = new Date();

    // Find all "Order Placed" orders before the current order (to calculate the estimated completion time)
    const previousOrders = await prisma.order.findMany({
      where: {
        status: "Order Placed",
        date: {
          lt: currentTime, // Orders placed before the current order
        },
      },
      include: {
        orderItem: {
          include: {
            food: true, // Ensure the food data is included for each order item
          },
        },
      },
    });

    // Calculate the total prep time of all previous orders
    let totalPreviousOrdersPrepTime = 0;
    previousOrders.forEach((order) => {
      order.orderItem.forEach((item) => {
        if (item.food && item.food.prepTime) {
          totalPreviousOrdersPrepTime += item.food.prepTime; // Add up prepTime for each item
        }
      });
    });

    // Estimate the completion time by adding the total prep time of previous orders and the current one
    const totalTimeInMinutes =
      totalPreviousOrdersPrepTime + totalPrepTimeInMinutes;
    const estimatedCompletionTime = new Date(
      currentTime.getTime() + totalTimeInMinutes * 60000
    ); // Convert minutes to milliseconds

    // Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        items,
        address,
        amount,
        paymentMethod: "COD", // Cash on Delivery
        isPaid: false,
        date: currentTime,
        status: "Order Placed", // Initial status
        estimatedCompletionTime, // Set the estimated completion time
        totalPrepTime: totalPrepTimeInMinutes, // Save the total prep time in minutes
      },
    });

    // Insert items into the orderItem table
    const orderItems = items.map((item) => ({
      orderId: newOrder.id, // Link the item to the new order
      foodId: item.id, // Link the item to the food table
      quantity: item.quantity,
      price: item.price, // Price from the frontend item data
      cookingStatus: "Not Started", // Default cooking status
    }));

    // Add orderItems to the database
    await prisma.orderItem.createMany({
      data: orderItems,
    });

    // Clear the user's cart after placing an order
    await prisma.user.update({
      where: { id: userId },
      data: { cartData: {} }, // Clear the user's cart after placing an order
    });

    res.json({ success: true, message: "Order Placed successfully" });
  } catch (error) {
    console.error(error);
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

// canceling orders before they get to chef
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Update the order status to "canceled"
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "Canceled" },
    });

    res.json({
      success: true,
      message: "Order has been canceled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Function to fetch order items for a specific order
const getOrderItemsForChef = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Fetch order items for the given order ID
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: parseInt(orderId) },
      include: {
        food: true, // Include food details
      },
    });

    if (!orderItems.length) {
      return res.json({
        success: false,
        message: "No items found for this order",
      });
    }

    // Format the response with food item details and cooking status
    const formattedOrderItems = orderItems.map((item) => ({
      id: item.id,
      foodName: item.food.name,
      description: item.food.description,
      price: item.price,
      quantity: item.quantity,
      cookingStatus: item.cookingStatus,
      startedAt: item.startedAt,
      completedAt: item.completedAt,
    }));

    res.json({
      success: true,
      items: formattedOrderItems,
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  acceptOrder,
  allOrders,
  cancelOrder,
  completeOrder,
  displayOrdersForChef,
  getOrderItemsForChef,
  PlaceOrder,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
};
