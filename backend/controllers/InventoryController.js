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
    const inventoryId = parseInt(req.body.inventoryId, 10);
    const quantityToAdd = parseInt(req.body.quantity, 10) || 0;
    const pricePerUnit = req.body.pricePerUnit
      ? parseFloat(req.body.pricePerUnit)
      : null; // Default to null if not provided
    const supplier = req.body.supplier || undefined; // Optional field
    const expiryDate = req.body.expiryDate
      ? new Date(req.body.expiryDate)
      : undefined;
    const dateReceived = req.body.dateReceived
      ? new Date(req.body.dateReceived)
      : new Date();

    if (!inventoryId || isNaN(inventoryId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing inventoryId" });
    }

    const currentInventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!currentInventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    let newStatus = currentInventory.status;
    if (quantityToAdd > 0) {
      newStatus =
        currentInventory.quantity + quantityToAdd ===
        currentInventory.initialQuantity
          ? "full"
          : "available";
    } else if (currentInventory.quantity + quantityToAdd <= 0) {
      newStatus = "empty";
    }

    // Dynamically construct the update data
    const inventoryData = {
      quantity: { increment: quantityToAdd },
      status: newStatus,
      dateReceived: dateReceived,
      dateUpdated: new Date(),
    };

    // Conditionally add fields only if they exist in the request
    if (pricePerUnit !== null) inventoryData.pricePerUnit = pricePerUnit;
    if (supplier) inventoryData.supplier = supplier;
    if (expiryDate) inventoryData.expiryDate = expiryDate;

    console.log("Data being sent to Prisma update:", inventoryData);

    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: inventoryData,
    });

    console.log("Updated Inventory:", updatedInventory);

    const purchaseRecord = {
      inventoryId,
      purchaseDate: new Date(),
      quantityBought: quantityToAdd,
      pricePerUnit: pricePerUnit || currentInventory.pricePerUnit,
      supplier: supplier || currentInventory.supplier,
      cost: pricePerUnit ? pricePerUnit * quantityToAdd : null,
    };

    console.log("Purchase Record Data:", purchaseRecord);

    await prisma.inventoryPurchase.create({
      data: purchaseRecord,
    });

    res.json({
      success: true,
      message: "Inventory stock added successfully",
      data: updatedInventory,
    });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({
      success: false,
      message: "Error adding stock",
    });
  }
};

// Request inventory item
const requestInventoryItem = async (req, res) => {
  // Log an inventory request
};

// Withdraw item from inventory and log the withdrawal
const withdrawItem = async (req, res) => {
  // Reduce stock and log withdrawal
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
