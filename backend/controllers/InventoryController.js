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
        pricePerUnit: 0,
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

// Add stock item
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

    // Calculate the updated quantity
    const updatedQuantity = inventoryItem.quantity + quantity;

    // Check if the updated quantity exceeds the initial quantity
    let updatedInitialQuantity = inventoryItem.initialQuantity;

    if (updatedQuantity > updatedInitialQuantity) {
      // If so, update initialQuantity to match the updatedQuantity
      updatedInitialQuantity = updatedQuantity;
    }

    // Update inventory data
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: updatedQuantity,
        initialQuantity: updatedInitialQuantity, // Update the initial quantity
        pricePerUnit,
        supplier,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        dateReceived: new Date(dateReceived),
        dateUpdated: new Date(), // Update the dateUpdated to the current timestamp
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

    // Call the function to calculate and store the percentage in the status field
    await calculateStockPercentageAndStoreInStatus(inventoryId);

    // Respond with success and updated inventory data
    return res.status(200).json({
      success: true,
      message: "Stock added successfully",
      updatedInventory,
    });
  } catch (error) {
    console.error("Error in addStock:", error); // Existing general error log
    console.error("Detailed error in addStock:", error); // Add detailed logging
    if (error.meta) {
      console.error("Error meta:", error.meta); // Prisma-specific error details, if present
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Handle inventory item request
const requestInventoryItem = async (req, res) => {
  try {
    // Extracting and parsing data from the request body
    const { inventoryId, empId, quantity } = req.body;

    // Input validation
    if (!inventoryId || !empId || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Convert `inventoryId` and `quantity` to integers
    const parsedInventoryId = parseInt(inventoryId, 10);
    const parsedQuantity = parseInt(quantity, 10);

    // Check if the conversion was successful
    if (isNaN(parsedInventoryId) || isNaN(parsedQuantity)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inventoryId or quantity" });
    }

    // Check if the inventory item exists
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: parsedInventoryId },
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Check if the quantity requested is available
    if (inventoryItem.quantity < parsedQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient inventory quantity" });
    }

    // Create the inventory request
    const inventoryRequest = await prisma.inventoryrequest.create({
      data: {
        inventoryId: parsedInventoryId,
        employeeId: empId,
        quantity: parsedQuantity,
        dateRequested: new Date(), // Current date and time
        status: "sent", // Default status
      },
    });

    // Respond with success and the created request data
    return res.status(201).json({
      success: true,
      message: "Inventory request created successfully",
      inventoryRequest,
    });
  } catch (error) {
    console.error("Error in requestInventoryItem:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
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

    // Calculate new quantity
    const newQuantity = inventoryItem.quantity - quantity;

    // Update inventory quantity and other fields
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryItem.id },
      data: {
        quantity: newQuantity,
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

    // Update the status field with the new stock percentage
    await calculateStockPercentageAndStoreInStatus(inventoryId);

    // Check status and order inventory if needed
    await orderInventory(inventoryId);

    res.json({
      success: true,
      message: "Item withdrawn successfully and inventory checked for reorder.",
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

// Order new stock automatically if inventory status is below the threshold
const orderInventory = async (inventoryId) => {
  try {
    // Find the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: parseInt(inventoryId, 10) },
    });

    if (!inventoryItem) {
      console.error("Inventory item not found for ordering.");
      return;
    }

    // Convert status to an integer
    const status = parseInt(inventoryItem.status, 10);

    if (isNaN(status)) {
      console.error(
        "Status is not a valid number. Cannot determine reorder necessity."
      );
      return;
    }

    // Check if status is below the reorder threshold
    const reorderThreshold = 5;
    if (status >= reorderThreshold) {
      console.log("Stock status is sufficient, no order needed.");
      return;
    }

    // Determine the quantity to order (e.g., replenish to 50 units)
    const quantityToOrder =
      inventoryItem.initialQuantity - inventoryItem.quantity;

    // Create a supplier order
    const newSupplierOrder = await prisma.supplierorder.create({
      data: {
        inventoryId: inventoryItem.id,
        quantityOrdered: quantityToOrder,
        supplier: inventoryItem.supplier || "Default Supplier",
        status: "Sent",
      },
    });

    console.log("Supplier order created:", newSupplierOrder);
    return newSupplierOrder;
  } catch (error) {
    console.error("Error creating supplier order:", error);
  }
};

// Fetch all supplier orders with inventory details
const getSupplierOrders = async (req, res) => {
  try {
    // Query supplierorder table and include related inventory details
    const supplierOrders = await prisma.supplierorder.findMany({
      include: {
        inventory: {
          select: {
            name: true,
            pricePerUnit: true,
            unit: true,
            status: true,
          },
        },
      },
    });

    // Format the response to include both supplier order and inventory details
    const formattedOrders = supplierOrders.map((order) => ({
      id: order.id,
      inventoryId: order.inventoryId,
      inventoryName: order.inventory.name,
      quantityOrdered: order.quantityOrdered,
      unit: order.inventory.unit,
      pricePerUnit: order.inventory.pricePerUnit,
      totalPrice: order.quantityOrdered * (order.inventory.pricePerUnit || 0), // Calculate total price
      orderDate: order.orderDate,
      supplier: order.supplier,
      orderStatus: order.status,
      inventoryStatus: order.inventory.status,
    }));

    // Send the data to the frontend
    return res.status(200).json({
      success: true,
      message: "Supplier orders retrieved successfully",
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error retrieving supplier orders:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving supplier orders",
    });
  }
};

// Check for low stock items and alert managers if necessary
const checkInventoryThreshold = async (req, res) => {
  // Check if any item falls below a set threshold and notify managers
};

// Log changes to inventory for auditing purposes
const logInventoryChange = async (req, res) => {
  // Record changes to inventory for accountability
};

// Function to calculate stock left as a percentage and store the exact percentage in the status field
// Function to calculate stock left as a percentage and store the exact percentage in the status field
const calculateStockPercentageAndStoreInStatus = async (inventoryId) => {
  try {
    // Retrieve the inventory item by ID
    const item = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!item || !item.initialQuantity || item.initialQuantity === 0) {
      throw new Error("Invalid item or initial quantity not set");
    }

    // Calculate the percentage of stock left
    const percentageLeft = (item.quantity / item.initialQuantity) * 100;

    // Round the percentage to the nearest integer
    const roundedPercentage = Math.round(percentageLeft);

    // Log the rounded percentage for debugging
    console.log(
      `Inventory ID: ${inventoryId}, Percentage Left: ${roundedPercentage}%`
    );

    // Store the rounded percentage as a string in the status field
    await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        status: `${roundedPercentage}`, // Ensure status is a string like "59"
      },
    });

    return { percentageLeft: roundedPercentage }; // Return the rounded percentage of stock left
  } catch (error) {
    console.error(
      "Error calculating stock percentage and storing in status:",
      error
    );
    throw error;
  }
};

// Export all functions
export {
  addInventory,
  addInventoryBulk,
  addStock,
  calculateStockPercentageAndStoreInStatus,
  checkInventoryThreshold,
  generateReport,
  generateUsageReport,
  getSupplierOrders,
  listInventory,
  logInventoryChange,
  removeInventory,
  requestInventoryItem,
  updateInventory,
  updateInventoryAttributes,
  withdrawItem,
};
