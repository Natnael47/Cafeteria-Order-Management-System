import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Utility function to delete an image file
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully:", imagePath);
      }
    });
  } else {
    console.log("Image file not found, skipping deletion:", imagePath);
  }
};

// Add new inventory item with optional image upload
const addInventory = async (req, res) => {
  try {
    const imageFilename = req.file ? req.file.filename : null;

    const inventoryItem = await prisma.inventory.create({
      data: {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description || null,
        quantity: 0,
        initialQuantity: 0,
        unit: req.body.unit,
        pricePerUnit: req.body.pricePerUnit
          ? parseFloat(req.body.pricePerUnit)
          : null,
        status: "empty", // Setting default status
        dateReceived: new Date(), // Set to today's date
        supplier: null, // Optional field
        expiryDate: null, // Optional field
        image: imageFilename,
      },
    });

    res.json({
      success: true,
      message: "Inventory item added",
      data: inventoryItem,
    });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding inventory item" });
  }
};

// Bulk add multiple inventory items
const addInventoryBulk = async (req, res) => {
  // Code to add multiple items at once
};

// List all inventory items
const listInventory = async (req, res) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      orderBy: { id: "desc" },
    });
    res.json({ success: true, data: inventoryItems });
  } catch (error) {
    console.error("Error retrieving inventory items:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving inventory items" });
  }
};

// Remove an inventory item and delete associated image if it exists
const removeInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10);
    if (isNaN(itemId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inventory item ID" });
    }

    // Check if item exists
    const item = await prisma.inventory.findUnique({
      where: { id: itemId },
      include: {
        purchaseRecords: true,
        requests: true,
        withdrawalLogs: true,
        supplierOrders: true,
      },
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Delete related records
    await prisma.inventoryPurchase.deleteMany({
      where: { inventoryId: itemId },
    });
    await prisma.inventoryRequest.deleteMany({
      where: { inventoryId: itemId },
    });
    await prisma.withdrawalLog.deleteMany({ where: { inventoryId: itemId } });
    await prisma.supplierOrder.deleteMany({ where: { inventoryId: itemId } });

    // Delete the inventory item
    await prisma.inventory.delete({ where: { id: itemId } });

    // Optional: Delete image file if exists
    if (item.image) {
      deleteImage(path.join("upload_inv", item.image));
    }

    res.json({ success: true, message: "Inventory item removed" });
  } catch (error) {
    console.error("Error removing inventory item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing inventory item" });
  }
};

// Update inventory item, including image management
const updateInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10);
    if (isNaN(itemId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid inventory item ID" });
      return;
    }

    const existingItem = await prisma.inventory.findUnique({
      where: { id: itemId },
    });
    if (!existingItem) {
      res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
      return;
    }

    let imageFilename = existingItem.image;
    if (req.file) {
      if (existingItem.image) {
        deleteImage(path.join("upload_inv", existingItem.image));
      }
      imageFilename = req.file.filename;
    }

    const updatedItem = await prisma.inventory.update({
      where: { id: itemId },
      data: {
        name: req.body.name || existingItem.name,
        category: req.body.category || existingItem.category,
        description: req.body.description || existingItem.description,
        quantity:
          req.body.quantity !== undefined
            ? parseInt(req.body.quantity)
            : existingItem.quantity,
        initialQuantity:
          req.body.initialQuantity !== undefined
            ? parseInt(req.body.initialQuantity)
            : existingItem.initialQuantity, // Update initial quantity
        unit: req.body.unit || existingItem.unit,
        pricePerUnit: req.body.pricePerUnit
          ? parseFloat(req.body.pricePerUnit)
          : existingItem.pricePerUnit,
        status: req.body.status || existingItem.status,
        dateReceived: req.body.dateReceived
          ? new Date(req.body.dateReceived)
          : existingItem.dateReceived,
        supplier: req.body.supplier || existingItem.supplier,
        expiryDate: req.body.expiryDate
          ? new Date(req.body.expiryDate)
          : existingItem.expiryDate,
        image: imageFilename,
      },
    });

    res.json({
      success: true,
      message: "Inventory item updated",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating inventory item" });
  }
};

// Update item in inventory and Save data on Purchase request
const addStock = async (req, res) => {
  try {
    // Extracting data from the request body
    const {
      inventoryId,
      quantity,
      pricePerUnit,
      supplier,
      expiryDate,
      dateReceived,
    } = req.body;

    // Input validation
    if (!inventoryId || !quantity || !pricePerUnit || !dateReceived) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Fetch the inventory item by ID
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Update inventory data
    const updatedQuantity = inventoryItem.quantity + quantity;
    const status = updatedQuantity > 100 ? "full" : "available";

    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: updatedQuantity,
        pricePerUnit,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        dateReceived: new Date(dateReceived),
        dateUpdated: new Date(), // Update the dateUpdated to the current timestamp
        status,
      },
    });

    // Save purchase details to the inventorypurchase table
    await prisma.inventorypurchase.create({
      data: {
        inventoryId,
        quantityBought: quantity,
        supplier,
        cost: quantity * pricePerUnit,
        pricePerUnit,
      },
    });

    // Respond with success and updated inventory data
    return res.status(200).json({
      success: true,
      message: "Stock added successfully",
      updatedInventory,
    });
  } catch (error) {
    console.error("Error in addStock:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Request inventory item
const requestInventoryItem = async (req, res) => {
  // Log an inventory request
};

// Withdraw item from inventory and log the withdrawal
const withdrawItem = async (req, res) => {
  try {
    const { inventoryId, withdrawnBy, quantity } = req.body;

    // Validate input
    if (
      !inventoryId ||
      !withdrawnBy ||
      !quantity ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input: Ensure all required fields are filled with valid data",
      });
    }

    // Find the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: parseInt(inventoryId, 10) },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Check if enough stock is available
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available for withdrawal",
      });
    }

    // Calculate new quantity and status
    const newQuantity = inventoryItem.quantity - quantity;
    const newStatus =
      newQuantity <= 0 ? "empty" : newQuantity <= 5 ? "low" : "available";

    // Update inventory quantity and status
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryItem.id },
      data: {
        quantity: newQuantity,
        status: newStatus,
        dateUpdated: new Date(),
      },
    });

    // Log the withdrawal in withdrawallog table
    const withdrawalLog = await prisma.withdrawallog.create({
      data: {
        inventoryId: inventoryItem.id,
        withdrawnBy,
        quantity,
        dateWithdrawn: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Item withdrawn successfully",
      data: {
        updatedInventory,
        withdrawalLog,
      },
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
    });
  }
};

// Update inventory attributes
const updateInventoryAttributes = async (req, res) => {
  // Update fields for a specific inventory item
};

// Generate usage report for a specified time period
const generateUsageReport = async (req, res) => {
  // Summarize usage of items within a time range
};

// Generate daily or monthly report
const generateReport = async (req, res) => {
  // Create a summarized report of inventory data
};

// Order inventory from supplier
const orderInventory = async (req, res) => {
  // Log order details in SupplierOrder table
};

// Check for low stock items and alert managers if necessary
const checkInventoryThreshold = async (req, res) => {
  // Check if any item falls below a set threshold and notify managers
};

// Log changes to inventory for auditing purposes
const logInventoryChange = async (req, res) => {
  // Record changes to inventory for accountability
};

// Function to calculate stock left as a percentage
const calculateStockPercentage = async (inventoryId) => {
  try {
    const item = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!item || !item.initialQuantity || item.initialQuantity === 0) {
      throw new Error("Invalid item or initial quantity not set");
    }

    const percentageLeft = (item.quantity / item.initialQuantity) * 100;
    return percentageLeft;
  } catch (error) {
    console.error("Error calculating stock percentage:", error);
    throw error;
  }
};

// Export all functions
export {
  addInventory,
  addInventoryBulk,
  addStock,
  calculateStockPercentage,
  checkInventoryThreshold,
  generateReport,
  generateUsageReport,
  listInventory,
  logInventoryChange,
  orderInventory,
  removeInventory,
  requestInventoryItem,
  updateInventory,
  updateInventoryAttributes,
  withdrawItem,
};
