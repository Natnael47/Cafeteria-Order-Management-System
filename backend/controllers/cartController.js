import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Add items to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find the user by ID
    const userData = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Parse and update the cart data
    let cartData = userData.cartData || {}; // Ensure cartData is an object
    cartData[itemId] = (cartData[itemId] || 0) + 1; // Increment item quantity or set to 1 if not present

    // Update the user's cart data
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { cartData },
    });

    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove items from cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find the user by ID
    const userData = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Parse and update the cart data
    let cartData = userData.cartData || {};
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId]; // Remove the item if quantity is zero
    }

    // Update the user's cart data
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { cartData },
    });

    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get cart items
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID
    const userData = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {}; // Ensure cartData is an object
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, getCart, removeFromCart };
