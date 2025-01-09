import { PrismaClient } from "@prisma/client";
import { Chapa } from "chapa-nodejs";
import Stripe from "stripe";

// Prisma Client initialization
const prisma = new PrismaClient();

// Stripe gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const chapa = new Chapa({
  secretKey: "CHASECK_TEST-4wYWgJax7I9mGoIxiv7YO6Pdu9QN8LOv",
});
//const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);

// const tx_ref = await chapa.genTxRef(); // result: TX-JHBUVLM7HYMSWDA

// Global Variables
const currency = "ETB";
const delivery_charge = 10;

const PlaceOrderChapa = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    // Validate input data
    if (!userId || !items || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    if (
      !address?.firstName ||
      !address?.lastName ||
      !address?.email ||
      !address?.phone ||
      typeof address.firstName !== "string" ||
      typeof address.lastName !== "string" ||
      typeof address.email !== "string" ||
      typeof address.phone !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address details" });
    }

    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // Generate a transaction reference
    const tx_ref = await chapa.genTxRef();

    // Build payload for Chapa
    const payload = {
      first_name: address.firstName,
      last_name: address.lastName,
      email: "chapa@gmail.com",
      phone_number: address.phone,
      currency: "ETB",
      amount: amount.toString(),
      tx_ref: tx_ref,
      callback_url: origin
        ? `${origin}/verify-chapa?success=true`
        : "https://example.com/",
      return_url: "http://localhost:5174/myorders",
      customization: {
        title: "Your Order",
        description: "Order payment description",
      },
    };

    console.log("Chapa Payload:", JSON.stringify(payload, null, 2));

    // Initialize the Chapa transaction
    const response = await chapa.initialize(payload);

    console.log("Chapa Response:", response);

    if (response.status === "success") {
      // Create the order in the database
      const newOrder = await prisma.order.create({
        data: {
          userId,
          address,
          items,
          amount,
          paymentMethod: "chapa",
          isPaid: false,
          date: new Date(),
          status: "Order Placed", // Set initial status to "Order Placed"
        },
      });

      // Redirect user to Chapa checkout URL
      const checkoutUrl = response.data.checkout_url;

      return res.status(200).json({ success: true, checkout_url: checkoutUrl });
    } else {
      throw new Error(response.message || "Chapa initialization failed");
    }
  } catch (error) {
    console.error("Error placing order with Chapa:", error);

    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error placing order with Chapa",
    });
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
        isPaid: true,
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

// Placing orders with support for delivery and dine-in
const PlaceOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, serviceType, dineInTime } =
      req.body;

    // Validate the required fields
    if (!userId || !items || !items.length || !amount || !serviceType) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Validate service type
    if (!["Delivery", "Dine-In"].includes(serviceType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid service type" });
    }

    // Handle dineInTime for Dine-In orders
    let dineInTimestamp = null;
    if (serviceType === "Dine-In") {
      if (!dineInTime) {
        return res
          .status(400)
          .json({ success: false, message: "Dine-in time is required" });
      }

      // Convert "HH:mm" format to ISO 8601 timestamp
      const currentDate = new Date();
      const [hours, minutes] = dineInTime.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid dine-in time format" });
      }

      dineInTimestamp = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        hours,
        minutes
      );

      if (isNaN(dineInTimestamp.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid dine-in time" });
      }
    }

    // Validate and calculate the total preparation time for the order
    const totalPrepTimeInMinutes = items.reduce((total, item) => {
      const prepTime = parseInt(item.prepTime, 10);
      return total + (isNaN(prepTime) ? 0 : prepTime);
    }, 0);

    const currentTime = new Date();

    // Find all "Order Placed" and "Preparing" orders before the current order
    const previousOrders = await prisma.order.findMany({
      where: {
        status: { in: ["Order Placed", "Preparing"] },
        date: { lt: currentTime },
      },
      include: {
        orderItem: {
          include: { food: true, Drink: true },
        },
      },
    });

    let totalPreviousOrdersPrepTime = 0;
    previousOrders.forEach((order) => {
      order.orderItem.forEach((item) => {
        if (item.food && item.food.prepTime) {
          totalPreviousOrdersPrepTime += parseInt(item.food.prepTime, 10) || 0;
        }
      });
    });

    const totalTimeInMinutes =
      totalPreviousOrdersPrepTime + totalPrepTimeInMinutes;
    const estimatedCompletionTime = new Date(
      currentTime.getTime() + totalTimeInMinutes * 60000
    );

    // Prepare the address field based on service type
    const formattedAddress =
      serviceType === "Delivery"
        ? {
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
          }
        : {
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
          };

    // Create the order in the database
    const newOrder = await prisma.order.create({
      data: {
        userId,
        address: formattedAddress,
        serviceType,
        dineInTime: dineInTimestamp,
        amount,
        items, // Save items as an array
        paymentMethod: "COD",
        isPaid: false,
        date: currentTime,
        status: "Order Placed",
        estimatedCompletionTime,
        totalPrepTime: totalPrepTimeInMinutes,
      },
    });

    // Insert items into the orderItem table
    const orderItems = items
      .map((item) => {
        if (item.type === "food") {
          return {
            orderId: newOrder.id,
            foodId: item.id,
            quantity: item.quantity,
            price: item.price,
            cookingStatus: "Not Started",
          };
        } else if (item.type === "drink") {
          return {
            orderId: newOrder.id,
            drinkId: item.id,
            quantity: item.quantity,
            price: item.price,
            cookingStatus: "Not Started",
          };
        }
        return null;
      })
      .filter(Boolean);

    await prisma.orderItem.createMany({ data: orderItems });

    // Clear the user's cart after placing the order
    await prisma.user.update({
      where: { id: userId },
      data: { cartData: {} },
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

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

// Function to get customization notes for food or drinks
const getCustomizationNotes = async (req, res) => {
  try {
    const customizations = await prisma.customization.findMany({
      select: {
        id: true,
        userId: true,
        customNote: true,
        createdAt: true,
        lastUpdated: true,
        foodId: true,
        drinkId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Process the data to determine type (food or drink)
    const processedCustomizations = customizations.map((item) => ({
      ...item,
      type: item.foodId ? "food" : item.drinkId ? "drink" : "unknown",
    }));

    res.json({ success: true, customizations: processedCustomizations });
  } catch (error) {
    console.error("Error fetching customizations:", error);
    res.status(500).json({ success: false, message: error.message });
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

// Function to update order item status and possibly complete the order
const completeOrderItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.json({
        success: false,
        message: "Item ID is required",
      });
    }

    // Find the order item by ID
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
    });

    if (!orderItem) {
      return res.json({
        success: false,
        message: "Order item not found",
      });
    }

    const { orderId } = orderItem;

    // Update the cooking status and complete time of the order item
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        cookingStatus: "Done",
        completedAt: new Date(),
      },
    });

    // Check if there are any other food items in the same order still being prepared
    const remainingFoodItems = await prisma.orderItem.findMany({
      where: {
        orderId,
        cookingStatus: {
          not: "Done", // Find items not yet marked as "Done"
        },
        foodId: {
          not: null, // Ensure it's a food item
        },
      },
    });

    if (remainingFoodItems.length === 0) {
      // Mark all drink items in the order as complete
      await prisma.orderItem.updateMany({
        where: {
          orderId,
          drinkId: {
            not: null, // Ensure it's a drink item
          },
          cookingStatus: {
            not: "Done", // Only update drinks not already marked as "Done"
          },
        },
        data: {
          cookingStatus: "Done",
          completedAt: new Date(),
        },
      });

      // Check if all items (food and drinks) are complete
      const remainingItems = await prisma.orderItem.findMany({
        where: {
          orderId,
          cookingStatus: {
            not: "Done", // Find items not yet marked as "Done"
          },
        },
      });

      if (remainingItems.length === 0) {
        // If all items are done, mark the order as complete
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "Complete",
          },
        });
      }
    }

    res.json({
      success: true,
      message: "Order item updated successfully",
    });
  } catch (error) {
    console.error("Error updating order item status:", error);
    res.json({
      success: false,
      message: error.message,
    });
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

// Fetch user orders with cooking status for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch orders along with their associated order items
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItem: {
          select: {
            foodId: true,
            drinkId: true,
            cookingStatus: true,
          },
        },
      },
    });

    // Format the order items to return foodId or drinkId based on the type
    const formattedOrders = orders.map((order) => {
      const formattedItems = order.orderItem.map((item) => {
        if (item.foodId) {
          // If the item is food, return foodId and cookingStatus
          return {
            foodId: item.foodId,
            cookingStatus: item.cookingStatus,
          };
        } else if (item.drinkId) {
          // If the item is a drink, return drinkId and cookingStatus
          return {
            drinkId: item.drinkId,
            cookingStatus: item.cookingStatus,
          };
        }
      });

      return {
        ...order,
        orderItem: formattedItems,
      };
    });

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
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

// Function to fetch order items for a specific order (only food items)
const getOrderItemsForChef = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Fetch order items for the given order ID, filtering only food items
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: parseInt(orderId),
        foodId: { not: null }, // Ensure only food items are included
      },
      include: {
        food: true, // Include food details
      },
    });

    if (!orderItems.length) {
      return res.json({
        success: false,
        message: "No food items found for this order",
      });
    }

    // Format the response with food item details and cooking status, including the foodId
    const formattedOrderItems = orderItems.map((item) => ({
      id: item.id,
      foodId: item.foodId, // Send the foodId as well
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
  completeOrderItem,
  displayOrdersForChef,
  getCustomizationNotes,
  getOrderItemsForChef,
  PlaceOrder,
  PlaceOrderChapa,
  PlaceOrderRazorpay,
  PlaceOrderStripe,
  updateStatus,
  userOrders,
  verifyStripe,
};
