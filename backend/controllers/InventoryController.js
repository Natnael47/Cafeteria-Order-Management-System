import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

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
        status: "0", // Setting default status
        dateReceived: new Date(), // Set to today's date
        supplierId: null, // Optional field
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
    if (req.file) {
      fs.unlink(`upload_inv/${req.file.filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    if (error.code === "P2002") {
      res.status(400).json({
        success: false,
        message: `Inventory item with name "${req.body.name}" already exists.`,
      });
    } else {
      console.error("Error adding inventory item:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding inventory item" });
    }
  }
};

// Bulk add multiple inventory items
const addInventoryBulk = async (req, res) => {
  // Code to add multiple items at once
};

// List all inventory items with batch details (excluding batches with zero quantity)
const listInventory = async (req, res) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      orderBy: { id: "desc" },
      include: {
        StockBatch: {
          where: {
            quantityRemaining: {
              gt: 0, // Only include batches where quantityRemaining is greater than 0
            },
          },
          select: {
            batchNumber: true,
            quantityRemaining: true,
            expiryDate: true,
          },
        },
      },
    });

    res.json({ success: true, data: inventoryItems });
  } catch (error) {
    console.error("Error retrieving inventory items:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving inventory items" });
  }
};

// Update inventory item, including image management
const updateInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10);
    if (isNaN(itemId)) {
      res.status(400).json({ success: false, message: "Invalid inventory ID" });
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

    // Check for duplicate inventory name
    if (req.body.name && req.body.name !== existingItem.name) {
      const duplicateItem = await prisma.inventory.findUnique({
        where: { name: req.body.name },
      });
      if (duplicateItem) {
        if (req.file) {
          // Delete the newly uploaded image
          fs.unlink(`upload_inv/${req.file.filename}`, (err) => {
            if (err) console.error("Error deleting uploaded image:", err);
          });
        }
        res.status(400).json({
          success: false,
          message: `Inventory item with name "${req.body.name}" already exists.`,
        });
        return;
      }
    }

    let imageFilename = existingItem.image;
    if (req.file) {
      if (existingItem.image) {
        fs.unlink(`upload_inv/${existingItem.image}`, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      imageFilename = req.file.filename;
    }

    const updatedItem = await prisma.inventory.update({
      where: { id: itemId },
      data: {
        name: req.body.name || existingItem.name,
        category: req.body.category || existingItem.category,
        description: req.body.description || existingItem.description,
        quantity: req.body.quantity
          ? parseInt(req.body.quantity, 10)
          : existingItem.quantity,
        initialQuantity: req.body.initialQuantity
          ? parseInt(req.body.initialQuantity, 10)
          : existingItem.initialQuantity,
        unit: req.body.unit || existingItem.unit,
        pricePerUnit: req.body.pricePerUnit
          ? parseFloat(req.body.pricePerUnit)
          : existingItem.pricePerUnit,
        status: req.body.status || existingItem.status,
        dateReceived: req.body.dateReceived
          ? new Date(req.body.dateReceived)
          : existingItem.dateReceived,
        supplierId: req.body.supplierId || existingItem.supplierId,
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
    // Delete the newly uploaded image if an error occurs
    if (req.file) {
      fs.unlink(`upload_inv/${req.file.filename}`, (err) => {
        if (err) console.error("Error deleting uploaded image:", err);
      });
    }
    res.status(500).json({ success: false, message: "Error updating item" });
  }
};

// Add stock item
const addStock = async (req, res) => {
  try {
    const {
      inventoryId,
      quantity,
      pricePerUnit,
      supplierId,
      expiryDate,
      dateReceived,
      empId,
      batchNumber: providedBatchNumber, // Destructure batchNumber from req.body
    } = req.body;

    // Input validation
    if (
      !inventoryId ||
      !quantity ||
      !pricePerUnit ||
      !supplierId ||
      !dateReceived
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Fetch the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Determine batchNumber
    let batchNumber = providedBatchNumber; // Use the provided batchNumber, if available
    if (!batchNumber) {
      // Generate a new unique batchNumber if not provided
      do {
        batchNumber = `BATCH-#${Math.floor(100000 + Math.random() * 900000)}`; // Generate "BATCH-#XXXXXX"
        const existingBatch = await prisma.stockBatch.findUnique({
          where: { batchNumber },
        });
        if (!existingBatch) break; // Ensure uniqueness
      } while (true);
    }

    // Create a new batch in the StockBatch table
    const newBatch = await prisma.stockBatch.create({
      data: {
        batchNumber,
        inventoryId,
        supplierId,
        purchaseDate: new Date(dateReceived),
        quantityBought: quantity,
        pricePerUnit,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        quantityRemaining: quantity,
      },
    });

    // Update total quantity in the Inventory table
    const updatedQuantity = inventoryItem.quantity + quantity;
    const updatedInitialQuantity =
      updatedQuantity > inventoryItem.initialQuantity
        ? updatedQuantity
        : inventoryItem.initialQuantity;

    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: updatedQuantity,
        pricePerUnit: pricePerUnit,
        initialQuantity: updatedInitialQuantity,
        dateUpdated: new Date(),
      },
    });

    // Record purchase details in InventoryPurchase
    const newPurchase = await prisma.inventorypurchase.create({
      data: {
        inventoryId: parseInt(inventoryId, 10),
        quantityBought: quantity,
        supplierId,
        employeeId: empId,
        cost: quantity * pricePerUnit,
        pricePerUnit: pricePerUnit,
      },
    });

    // Recalculate stock percentage and store it in the status
    calculateStockPercentageAndStoreInStatus(inventoryId);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Stock added successfully",
      newBatch,
      newPurchase,
      updatedInventory,
    });
  } catch (error) {
    console.error("Error in addStock:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
        status: "submitted", // Default status
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
    const { inventoryId, reason, quantity, empId } = req.body;

    // Input validation
    if (
      !inventoryId ||
      !reason ||
      !quantity ||
      !empId ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: Ensure all required fields are valid",
      });
    }

    // Find inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available for withdrawal",
      });
    }

    let remainingQuantity = quantity;
    const batchesToUpdate = [];

    // Fetch oldest batches with remaining stock
    const stockBatches = await prisma.stockBatch.findMany({
      where: {
        inventoryId,
        quantityRemaining: { gt: 0 },
      },
      orderBy: { purchaseDate: "asc" }, // FIFO: Oldest batches first
    });

    for (const batch of stockBatches) {
      if (remainingQuantity <= 0) break;

      const deductQuantity = Math.min(
        batch.quantityRemaining,
        remainingQuantity
      );
      remainingQuantity -= deductQuantity;

      batchesToUpdate.push({
        id: batch.id,
        quantityRemaining: batch.quantityRemaining - deductQuantity,
      });
    }

    if (remainingQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available to fulfill the withdrawal",
      });
    }

    // Update the affected batches
    for (const batch of batchesToUpdate) {
      await prisma.stockBatch.update({
        where: { id: batch.id },
        data: { quantityRemaining: batch.quantityRemaining },
      });
    }

    // Update inventory total quantity
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: inventoryItem.quantity - quantity,
        dateUpdated: new Date(),
      },
    });

    // Update stock percentage and status
    await calculateStockPercentageAndStoreInStatus(inventoryId);

    // Fetch the updated inventory item to ensure correct status
    const updatedInventoryStatus = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    // Call orderInventory with the updated status
    if (updatedInventoryStatus) {
      await orderInventory(inventoryId);
    }

    // Log the withdrawal
    const withdrawalLog = await prisma.withdrawallog.create({
      data: {
        inventoryId,
        reason,
        employeeId: empId,
        quantity,
        dateWithdrawn: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Item withdrawn successfully",
      updatedInventory,
      withdrawalLog,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
    });
  }
};

// Withdraw item from inventory using LIFO logic
const withdrawItemFresh = async (req, res) => {
  try {
    const { inventoryId, reason, quantity, empId } = req.body;

    // Input validation
    if (
      !inventoryId ||
      !reason ||
      !quantity ||
      !empId ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input: Ensure all required fields are valid",
      });
    }

    // Find inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available for withdrawal",
      });
    }

    let remainingQuantity = quantity;
    const batchesToUpdate = [];

    // Fetch newest batches with remaining stock (LIFO: Newest batches first)
    const stockBatches = await prisma.stockBatch.findMany({
      where: {
        inventoryId,
        quantityRemaining: { gt: 0 },
      },
      orderBy: { purchaseDate: "desc" },
    });

    for (const batch of stockBatches) {
      if (remainingQuantity <= 0) break;

      const deductQuantity = Math.min(
        batch.quantityRemaining,
        remainingQuantity
      );
      remainingQuantity -= deductQuantity;

      batchesToUpdate.push({
        id: batch.id,
        quantityRemaining: batch.quantityRemaining - deductQuantity,
      });
    }

    if (remainingQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available to fulfill the withdrawal",
      });
    }

    // Update the affected batches
    for (const batch of batchesToUpdate) {
      await prisma.stockBatch.update({
        where: { id: batch.id },
        data: { quantityRemaining: batch.quantityRemaining },
      });
    }

    // Update inventory total quantity
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: inventoryItem.quantity - quantity,
        dateUpdated: new Date(),
      },
    });

    // Update stock percentage and status
    await calculateStockPercentageAndStoreInStatus(inventoryId);

    // Fetch the updated inventory item to ensure correct status
    const updatedInventoryStatus = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    // Call orderInventory with the updated status
    if (updatedInventoryStatus) {
      await orderInventory(inventoryId);
    }

    // Log the withdrawal
    const withdrawalLog = await prisma.withdrawallog.create({
      data: {
        inventoryId,
        reason,
        employeeId: empId,
        quantity,
        dateWithdrawn: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Item withdrawn successfully",
      updatedInventory,
      withdrawalLog,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
    });
  }
};

// Generate usage report for a specified time period
const generateUsageReport = async (req, res) => {
  // Summarize usage of items within a time range
};

// Generate daily or monthly report
const generateReport = async (req, res) => {
  // Create a summarized report of inventory data
};

// Get the correct __dirname for this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to delete an image file
const deleteImage = (imageName) => {
  // Construct the correct path to the image
  const fullPath = path.join(__dirname, "..", "upload_inv", imageName); // Navigate to upload_inv directory
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully:", fullPath);
      }
    });
  } else {
    console.log("Image file not found, skipping deletion:", fullPath);
  }
};

// Remove an inventory item and delete associated image if it exists
const removeInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10); // Ensure the ID is a number
    if (isNaN(itemId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inventory item ID" });
    }

    // Get the inventory item to check if it has an image
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: itemId },
      select: { image: true },
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Begin transaction to delete related records
    await prisma.$transaction(async (prisma) => {
      // Delete related records in inventorypurchase, inventoryrequest, withdrawallog, etc.
      await prisma.inventorypurchase.deleteMany({
        where: { inventoryId: itemId },
      });

      await prisma.inventoryrequest.deleteMany({
        where: { inventoryId: itemId },
      });

      await prisma.withdrawallog.deleteMany({
        where: { inventoryId: itemId },
      });

      await prisma.supplierorder.deleteMany({
        where: { inventoryId: itemId },
      });

      await prisma.inventorySupplier.deleteMany({
        where: { inventoryId: itemId },
      });

      // Finally, delete the inventory item itself
      await prisma.inventory.delete({
        where: { id: itemId },
      });

      // If the inventory item had an image, delete the image file
      if (inventoryItem.image) {
        deleteImage(inventoryItem.image); // Call the deleteImage function
      }
    });

    res.json({ success: true, message: "Inventory item removed successfully" });
  } catch (error) {
    console.error("Error removing inventory item:", error);

    // Handle known Prisma errors
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete inventory item: it is still referenced by related records",
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Error removing inventory item" });
  }
};

const orderInventory = async (inventoryId) => {
  try {
    // Find the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: parseInt(inventoryId, 10) },
      select: {
        quantity: true,
        initialQuantity: true,
        status: true,
        supplierId: true,
      },
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
    const reorderThreshold = 10;
    if (status >= reorderThreshold) {
      console.log(
        "Stock status is sufficient, no order needed.",
        inventoryId,
        status
      );
      return;
    }

    // Calculate quantity to order to restore initial levels
    const quantityToOrder =
      inventoryItem.initialQuantity - inventoryItem.quantity;

    if (quantityToOrder <= 0) {
      console.log(
        "Inventory already at or above initial levels. No order needed."
      );
      return;
    }

    // Create a supplier order
    const newSupplierOrder = await prisma.supplierorder.create({
      data: {
        inventoryId: inventoryId,
        quantityOrdered: quantityToOrder,
        supplierId: inventoryItem.supplierId,
        status: "Sent",
        orderDate: new Date(),
      },
    });

    console.log("Supplier order created successfully:", newSupplierOrder);
    return newSupplierOrder;
  } catch (error) {
    console.error("Error creating supplier order:", error);
  }
};

// Fetch all supplier orders with inventory details and packageId
const getSupplierOrders = async (req, res) => {
  try {
    // Query supplierorder table where status is not "done" and include related inventory details
    const supplierOrders = await prisma.supplierorder.findMany({
      where: { status: { not: "done" } }, // Exclude orders with status "done"
      include: {
        inventory: {
          select: {
            name: true,
            pricePerUnit: true,
            unit: true,
            status: true,
          },
        },
        supplier: {
          select: {
            name: true,
          },
        },
      },
    });

    // Format the response to include both supplier order and inventory details along with packageId
    const formattedOrders = supplierOrders.map((order) => ({
      id: order.id,
      inventoryId: order.inventoryId,
      inventoryName: order.inventory.name,
      quantityOrdered: order.quantityOrdered,
      unit: order.inventory.unit,
      pricePerUnit: order.inventory.pricePerUnit,
      totalPrice: order.quantityOrdered * (order.inventory.pricePerUnit || 0),
      orderDate: order.orderDate,
      supplierId: order.supplierId, // Ensure supplierId is included
      orderStatus: order.status,
      inventoryStatus: order.inventory.status,
      packageId: order.packageId, // Include the packageId field here
      supplierName: order.supplier.name,
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

const addSupplier = async (req, res) => {
  try {
    // Parse contactInfo if sent as JSON in the request body
    const contactInfo = req.body.contactInfo
      ? JSON.parse(req.body.contactInfo)
      : null;

    // Check if a supplier with the same name already exists
    const existingSupplierByName = await prisma.supplier.findUnique({
      where: { name: req.body.name },
    });

    if (existingSupplierByName) {
      return res.status(400).json({
        success: false,
        message: "Supplier name already exists",
      });
    }

    // Check if contactInfo exists and has an email
    if (contactInfo && contactInfo.email) {
      const existingSupplierByEmail = await prisma.supplier.findUnique({
        where: { email: contactInfo.email },
      });

      if (existingSupplierByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already associated with another supplier",
        });
      }
    }

    // Create new supplier
    const supplier = await prisma.supplier.create({
      data: {
        name: req.body.name,
        contactInfo: contactInfo, // Optional JSON data for contact information
        status: req.body.status || "active", // Default to "active" if not provided
      },
    });

    res.json({
      success: true,
      message: "Supplier added successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ success: false, message: "Error adding supplier" });
  }
};

// List all suppliers
const listSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { id: "desc" }, // Sort by ID in descending order
    });
    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error("Error retrieving suppliers:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving suppliers" });
  }
};

// Remove a supplier
const removeSupplier = async (req, res) => {
  try {
    const supplierId = parseInt(req.body.id, 10);
    if (isNaN(supplierId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid supplier ID" });
    }

    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    // Delete the supplier
    await prisma.supplier.delete({ where: { id: supplierId } });

    res.json({ success: true, message: "Supplier removed successfully" });
  } catch (error) {
    console.error("Error removing supplier:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing supplier" });
  }
};

// Update a supplier
const updateSupplier = async (req, res) => {
  try {
    const supplierId = parseInt(req.body.id, 10);
    if (isNaN(supplierId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid supplier ID" });
    }

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!existingSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    // Parse contactInfo if sent as JSON in the request body
    const contactInfo = req.body.contactInfo
      ? JSON.parse(req.body.contactInfo)
      : existingSupplier.contactInfo;

    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        name: req.body.name || existingSupplier.name,
        contactInfo: contactInfo, // Update contact info if provided
        status: req.body.status || existingSupplier.status, // Default to existing status
      },
    });

    res.json({
      success: true,
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating supplier" });
  }
};

// Function to ensure a unique inventory-supplier mapping
const ensureInventorySupplier = async (
  inventoryId,
  supplierId,
  pricePerUnit,
  payment = "cash on delivery"
) => {
  try {
    // Check if the inventory-supplier combination already exists
    const existingRecord = await prisma.inventorySupplier.findUnique({
      where: {
        inventoryId_supplierId: {
          // Use the composite key alias
          inventoryId,
          supplierId,
        },
      },
    });

    // If it exists, return the existing record
    if (existingRecord) {
      console.log("InventorySupplier record already exists:", existingRecord);
      return existingRecord;
    }

    // If it does not exist, create a new record
    const newRecord = await prisma.inventorySupplier.create({
      data: {
        inventoryId,
        supplierId,
        pricePerUnit,
        payment,
      },
    });

    console.log("New InventorySupplier record created:", newRecord);

    return newRecord;
  } catch (error) {
    console.error("Error ensuring inventory-supplier record:", error);
    throw new Error("Failed to ensure inventory-supplier mapping");
  }
};

const addToPackage = async (req, res) => {
  try {
    const { packageId, orderId } = req.body;

    // Validate that both packageId and orderId are provided
    if (!packageId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Package ID and Order ID are required",
      });
    }

    // Fetch the package and order details
    const [existingPackage, supplierOrder] = await Promise.all([
      prisma.inventoryPackage.findUnique({
        where: { id: packageId },
        select: {
          supplierId: true,
          status: true,
          totalCost: true,
          items: true,
        },
      }),
      prisma.supplierorder.findUnique({
        where: { id: orderId },
        select: {
          supplierId: true,
          inventoryId: true,
          quantityOrdered: true,
          orderDate: true,
          status: true,
          packageId: true,
        },
      }),
    ]);

    // If the package or order is not found, return an error
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (!supplierOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the order is not already part of a package
    if (supplierOrder.packageId !== null) {
      return res.status(400).json({
        success: false,
        message: "Order is already part of a package",
      });
    }

    // Validate that supplierId matches
    if (existingPackage.supplierId !== supplierOrder.supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier IDs do not match, cannot add order to package",
      });
    }

    // Fetch inventory details for the item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: supplierOrder.inventoryId },
      select: { pricePerUnit: true, name: true },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Calculate the order cost
    const orderCost =
      inventoryItem.pricePerUnit * supplierOrder.quantityOrdered;

    // Prepare the order data to be added to the package's items array
    const newItem = {
      inventoryId: supplierOrder.inventoryId,
      name: inventoryItem.name,
      quantityOrdered: supplierOrder.quantityOrdered,
      pricePerUnit: inventoryItem.pricePerUnit,
      cost: orderCost,
      orderDate: supplierOrder.orderDate,
      status: supplierOrder.status,
    };

    // Update the package's items array and total cost
    const updatedPackage = await prisma.inventoryPackage.update({
      where: { id: packageId },
      data: {
        totalCost: existingPackage.totalCost + orderCost,
        items: existingPackage.items
          ? [...existingPackage.items, newItem]
          : [newItem], // Add the new item to the items array
      },
    });

    // Update the order's packageId and status
    await prisma.supplierorder.update({
      where: { id: orderId },
      data: {
        packageId: packageId,
        status: "Sent",
      },
    });

    res.json({
      success: true,
      message: "Order successfully added to package",
      data: {
        packageId,
        updatedTotalCost: updatedPackage.totalCost,
        items: updatedPackage.items,
      },
    });
  } catch (error) {
    console.error("Error adding order to package:", error);
    res.status(500).json({
      success: false,
      message: "Error adding order to package",
      error: error.message,
    });
  }
};

const removeFromPackage = async (req, res) => {
  try {
    const { packageId, orderId } = req.body;

    // Validate input
    if (!packageId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Package ID and order ID are required",
      });
    }

    // Fetch the package and order details
    const [existingPackage, supplierOrder] = await Promise.all([
      prisma.inventoryPackage.findUnique({
        where: { id: packageId },
        select: { totalCost: true, items: true },
      }),
      prisma.supplierorder.findUnique({
        where: { id: orderId },
        select: { inventoryId: true, quantityOrdered: true, packageId: true },
      }),
    ]);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (!supplierOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the order is part of the given package
    if (supplierOrder.packageId !== packageId) {
      return res.status(400).json({
        success: false,
        message: "Order does not belong to the specified package",
      });
    }

    // Fetch the price per unit of the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: supplierOrder.inventoryId },
      select: { pricePerUnit: true, name: true },
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Calculate the cost to subtract
    const orderCost =
      inventoryItem.pricePerUnit * supplierOrder.quantityOrdered;

    // Find the item in the package's items array
    const updatedItems = existingPackage.items.filter(
      (item) => item.inventoryId !== supplierOrder.inventoryId
    );

    // Calculate the new total cost for the package
    const newTotalCost = existingPackage.totalCost - orderCost;

    // Remove the packageId from the supplier order and update status
    await prisma.supplierorder.update({
      where: { id: orderId },
      data: {
        packageId: null, // Remove packageId from the supplier order
        status: "Pending", // Optionally reset the status to "Pending"
      },
    });

    // Update the package's total cost and items array
    const updatedPackage = await prisma.inventoryPackage.update({
      where: { id: packageId },
      data: {
        totalCost: newTotalCost,
        items: updatedItems, // Update the items array by removing the item
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order removed from package successfully",
      data: {
        packageId,
        updatedTotalCost: newTotalCost,
        items: updatedPackage.items, // Return the updated items array
        orderId,
      },
    });
  } catch (error) {
    console.error("Error in removeFromPackage:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing order from package",
      error: error.message, // Include error message for debugging
    });
  }
};

const createPackage = async (req, res) => {
  try {
    // Extract fields from the request body
    const { name, description, packageType, supplierId, chefId } = req.body;

    // Input validation for required fields
    if (!name || !description || !packageType) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and packageType are required",
      });
    }

    // Validate packageType and corresponding IDs
    if (packageType === "Order" && !supplierId) {
      return res.status(400).json({
        success: false,
        message: "For 'Order' packageType, supplierId is required",
      });
    }

    if (packageType === "Request" && !chefId) {
      return res.status(400).json({
        success: false,
        message: "For 'Request' packageType, chefId is required",
      });
    }

    // Verify that the supplier exists if supplierId is provided
    if (packageType === "Order" && supplierId) {
      const existingSupplier = await prisma.supplier.findUnique({
        where: { id: supplierId },
      });

      if (!existingSupplier) {
        return res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      }
    }

    // Verify that the chef exists if chefId is provided
    if (packageType === "Request" && chefId) {
      const existingChef = await prisma.employee.findUnique({
        where: { id: chefId },
      });

      if (!existingChef) {
        return res.status(404).json({
          success: false,
          message: "Chef not found",
        });
      }
    }

    // Create a new package with appropriate fields
    const newPackage = await prisma.inventoryPackage.create({
      data: {
        name,
        description,
        packageType,
        status: "Pending", // Default status
        // Set supplierId or chefId based on packageType
        supplierId: packageType === "Order" ? supplierId : null,
        chefId: packageType === "Request" ? chefId : null,
      },
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Inventory package created successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error("Error creating inventory package:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// List all inventory packages along with related orders by packageId
const listInventoryPackages = async (req, res) => {
  try {
    // Fetch all inventory packages where status is not "done"
    const inventoryPackages = await prisma.inventoryPackage.findMany({
      where: { status: { not: "done" } }, // Exclude packages with status "done"
      orderBy: { id: "desc" }, // Ordering by ID in descending order
      include: {
        supplier: true, // Include related supplier data
      },
    });

    // Fetch all orders related to the fetched packages
    const packageIds = inventoryPackages.map((pkg) => pkg.id); // Extracting package IDs
    const supplierOrders = await prisma.supplierorder.findMany({
      where: {
        packageId: {
          in: packageIds, // Only fetch orders belonging to the listed packages
        },
      },
      select: {
        id: true, // Order ID
        inventoryId: true,
        quantityOrdered: true,
        orderDate: true,
        status: true,
        packageId: true,
        inventory: { select: { name: true, pricePerUnit: true } }, // Include related inventory item details
      },
    });

    // Combine the orders with their corresponding packages
    const formattedPackages = inventoryPackages.map((pkg) => ({
      ...pkg,
      orders: supplierOrders
        .filter((order) => order.packageId === pkg.id)
        .map((order) => ({
          orderId: order.id,
          inventoryId: order.inventoryId,
          quantityOrdered: order.quantityOrdered,
          orderDate: order.orderDate,
          status: order.status,
          inventory: order.inventory, // Include inventory details (name, price per unit)
        })),
    }));

    res.json({ success: true, data: formattedPackages });
  } catch (error) {
    console.error("Error retrieving inventory packages with orders:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving inventory packages with orders",
      error: error.message, // Include the error message for debugging
    });
  }
};

const addPackage = async (req, res) => {
  try {
    const { packageId, dateReceived, expiryDate, empId } = req.body;

    if (!packageId || !dateReceived) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: packageId and dateReceived",
      });
    }

    // Fetch package details
    const packageDetails = await prisma.inventoryPackage.findUnique({
      where: { id: parseInt(packageId, 10) },
      select: { supplierId: true },
    });

    if (!packageDetails) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    const { supplierId } = packageDetails;

    // Fetch all items in the package
    const orderItems = await prisma.supplierorder.findMany({
      where: { packageId: parseInt(packageId, 10) },
      select: {
        inventoryId: true,
        quantityOrdered: true,
      },
    });

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Package contains no inventory items",
      });
    }

    const batchNumbers = {}; // Store batch numbers per inventory item

    for (const item of orderItems) {
      const { inventoryId, quantityOrdered } = item;

      // Fetch inventory details
      const inventoryItem = await prisma.inventory.findUnique({
        where: { id: parseInt(inventoryId, 10) },
      });

      if (!inventoryItem) {
        console.warn(
          `Inventory item with ID ${inventoryId} not found, skipping.`
        );
        continue;
      }

      // Generate or retrieve batch number
      let batchNumber = batchNumbers[inventoryId];
      if (!batchNumber) {
        do {
          batchNumber = `BATCH-#${Math.floor(100000 + Math.random() * 900000)}`;
          const existingBatch = await prisma.stockBatch.findUnique({
            where: { batchNumber },
          });
          if (!existingBatch) break;
        } while (true);

        batchNumbers[inventoryId] = batchNumber; // Store batch number for reuse
      }

      // Create a new batch in StockBatch
      await prisma.stockBatch.create({
        data: {
          batchNumber,
          inventoryId: parseInt(inventoryId, 10),
          supplierId,
          purchaseDate: new Date(dateReceived),
          quantityBought: quantityOrdered,
          pricePerUnit: inventoryItem.pricePerUnit,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          quantityRemaining: quantityOrdered,
        },
      });

      // Update inventory quantities
      const updatedQuantity = inventoryItem.quantity + quantityOrdered;
      const updatedInitialQuantity =
        updatedQuantity > inventoryItem.initialQuantity
          ? updatedQuantity
          : inventoryItem.initialQuantity;

      await prisma.inventory.update({
        where: { id: parseInt(inventoryId, 10) },
        data: {
          quantity: updatedQuantity,
          pricePerUnit: inventoryItem.pricePerUnit,
          initialQuantity: updatedInitialQuantity,
          dateUpdated: new Date(),
        },
      });

      // Record purchase details in InventoryPurchase
      await prisma.inventorypurchase.create({
        data: {
          inventoryId: parseInt(inventoryId, 10),
          quantityBought: quantityOrdered,
          supplierId,
          employeeId: empId,
          cost: quantityOrdered * inventoryItem.pricePerUnit,
          pricePerUnit: inventoryItem.pricePerUnit,
        },
      });

      // Recalculate stock percentage and update status
      await calculateStockPercentageAndStoreInStatus(parseInt(inventoryId, 10));
    }

    // Update the status of the inventoryPackage to "done"
    await prisma.inventoryPackage.update({
      where: { id: parseInt(packageId, 10) },
      data: { status: "done" },
    });

    // Update the status of supplierOrder entries to "done"
    await prisma.supplierorder.updateMany({
      where: { packageId: parseInt(packageId, 10) },
      data: { status: "done" },
    });

    return res.status(200).json({
      success: true,
      message:
        "Package items added successfully with batch numbers assigned and statuses updated.",
    });
  } catch (error) {
    console.error("Error in addPackage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// List all inventory requests without "Approved" status
const listInventoryRequests = async (req, res) => {
  try {
    const inventoryRequests = await prisma.inventoryrequest.findMany({
      where: {
        NOT: {
          status: "Approved",
        },
      },
      orderBy: { dateRequested: "asc" },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
        inventory: {
          select: {
            id: true,
            name: true,
            image: true,
            status: true,
            quantity: true,
            unit: true,
          },
        },
      },
    });

    res.json({ success: true, data: inventoryRequests });
  } catch (error) {
    console.error("Error retrieving inventory requests:", error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving inventory requests" });
  }
};

//Dashboard
const getInventoryDashboardData = async (req, res) => {
  try {
    // Fetch KPIs
    const [
      totalItems,
      lowStockItems,
      totalRequestsProcessed,
      totalInventoryValue,
    ] = await Promise.all([
      prisma.inventory.count(), // Total Inventory Items
      prisma.inventory.count({
        where: { quantity: { lte: 10 } }, // Low Stock Threshold (<=10 as an example)
      }),
      prisma.inventoryrequest.count(), // Total Requests Processed
      prisma.inventory.aggregate({
        _sum: { quantity: true, pricePerUnit: true }, // Sum of quantity * pricePerUnit
      }),
    ]);

    // Fetch Inventory Overview
    const inventoryOverview = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        pricePerUnit: true,
        status: true,
        expiryDate: true,
      },
      orderBy: { id: "asc" }, // Example ordering
    });

    // Fetch Latest Updated Inventory Items
    const latestUpdatedItems = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        pricePerUnit: true,
        status: true,
        expiryDate: true,
      },
      orderBy: { dateUpdated: "desc" }, // Order by latest updates
      take: 6, // Fetch only the latest 6 items
    });

    // Fetch Graph Data
    const [inventoryByCategory, stockTrends, expenditureBySupplier] =
      await Promise.all([
        prisma.inventory.groupBy({
          by: ["category"],
          _count: { id: true },
        }), // Inventory by Category
        prisma.inventory.groupBy({
          by: ["dateUpdated"],
          _sum: { quantity: true },
          orderBy: { dateUpdated: "asc" },
        }), // Stock Trends
        prisma.inventorypurchase.groupBy({
          by: ["supplierId"],
          _sum: { cost: true },
          orderBy: { _sum: { cost: "desc" } },
        }), // Expenditure by Supplier
      ]);

    // Fetch Low Stock Alerts
    const lowStockAlerts = await prisma.inventory.findMany({
      where: { quantity: { lte: 10 } },
      select: {
        id: true,
        name: true,
        quantity: true,
        expiryDate: true,
        image: true,
      },
    });

    // Fetch Requests and Withdrawals
    const [pendingRequests, recentWithdrawals] = await Promise.all([
      prisma.inventoryrequest.findMany({
        where: { status: { not: "Completed" } }, // Pending Requests
        include: {
          employee: {
            select: { id: true, firstName: true, lastName: true },
          },
          inventory: {
            select: { name: true, quantity: true },
          },
        },
      }),
      prisma.withdrawallog.findMany({
        orderBy: { dateWithdrawn: "desc" },
        take: 10, // Recent Withdrawals
        include: {
          inventory: { select: { name: true } },
          employee: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    // Fetch Batch Management Data
    const batchDetails = await prisma.StockBatch.findMany({
      select: {
        batchNumber: true,
        inventory: { select: { name: true } },
        quantityRemaining: true,
        expiryDate: true,
        pricePerUnit: true,
      },
    });

    // Fetch Supplier Performance Data
    const supplierPerformance = await prisma.supplier.findMany({
      include: {
        inventorypurchase: {
          select: {
            cost: true,
            pricePerUnit: true,
          },
        },
      },
    });

    // Response structure
    res.status(200).json({
      success: true,
      data: {
        KPIs: {
          totalItems,
          lowStockItems,
          totalRequestsProcessed,
          totalInventoryValue:
            totalInventoryValue._sum.quantity *
            totalInventoryValue._sum.pricePerUnit,
        },
        inventoryOverview,
        latestUpdatedItems, // Include the new data in the response
        graphs: {
          inventoryByCategory,
          stockTrends,
          expenditureBySupplier,
        },
        alerts: lowStockAlerts,
        requestsAndWithdrawals: {
          pendingRequests,
          recentWithdrawals,
        },
        batchManagement: batchDetails,
        supplierPerformance,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
    });
  }
};

// Function to process inventory requests and withdraw stock
const processInventoryRequest = async (req, res) => {
  try {
    const { requestId, empId } = req.body;

    // Fetch the inventory request by ID
    const inventoryRequest = await prisma.inventoryrequest.findUnique({
      where: { id: requestId },
      include: {
        inventory: true,
      },
    });

    // Check if the request exists
    if (!inventoryRequest) {
      return res.status(404).json({
        success: false,
        message: "Inventory request not found",
      });
    }

    const { inventoryId, quantity } = inventoryRequest;

    // Find the inventory item
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    // Validate inventory availability
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available for withdrawal",
      });
    }

    let remainingQuantity = quantity;
    const batchesToUpdate = [];

    // Fetch oldest batches with remaining stock (FIFO logic)
    const stockBatches = await prisma.stockBatch.findMany({
      where: {
        inventoryId,
        quantityRemaining: { gt: 0 },
      },
      orderBy: { purchaseDate: "asc" },
    });

    for (const batch of stockBatches) {
      if (remainingQuantity <= 0) break;

      const deductQuantity = Math.min(
        batch.quantityRemaining,
        remainingQuantity
      );
      remainingQuantity -= deductQuantity;

      batchesToUpdate.push({
        id: batch.id,
        quantityRemaining: batch.quantityRemaining - deductQuantity,
      });
    }

    if (remainingQuantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available to fulfill the withdrawal",
      });
    }

    // Update the affected batches
    for (const batch of batchesToUpdate) {
      await prisma.stockBatch.update({
        where: { id: batch.id },
        data: { quantityRemaining: batch.quantityRemaining },
      });
    }

    // Update inventory total quantity
    await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: inventoryItem.quantity - quantity,
        dateUpdated: new Date(),
      },
    });

    // Log the withdrawal
    const withdrawalLog = await prisma.withdrawallog.create({
      data: {
        inventoryId,
        reason: "request",
        employeeId: empId,
        quantity,
        dateWithdrawn: new Date(),
      },
    });

    // Update stock percentage and status
    await calculateStockPercentageAndStoreInStatus(inventoryId);

    // Update the InventoryRequest with the withdrawal log ID and status
    await prisma.inventoryrequest.update({
      where: { id: requestId },
      data: {
        withdrawalLogId: withdrawalLog.id,
        status: "Approved", // Set the status to "Approved"
      },
    });

    res.json({
      success: true,
      message: "Inventory request processed successfully",
      withdrawalLog,
    });
  } catch (error) {
    console.error("Error processing inventory request:", error);
    res.status(500).json({
      success: false,
      message: "Error processing inventory request",
    });
  }
};

// Export all functions
export {
  addInventory,
  addInventoryBulk,
  addPackage,
  addStock,
  addSupplier,
  addToPackage,
  calculateStockPercentageAndStoreInStatus,
  checkInventoryThreshold,
  createPackage,
  generateReport,
  generateUsageReport,
  getInventoryDashboardData,
  getSupplierOrders,
  listInventory,
  listInventoryPackages,
  listInventoryRequests,
  listSuppliers,
  logInventoryChange,
  processInventoryRequest,
  removeFromPackage,
  removeInventory,
  removeSupplier,
  requestInventoryItem,
  updateInventory,
  updateSupplier,
  withdrawItem,
  withdrawItemFresh,
};
