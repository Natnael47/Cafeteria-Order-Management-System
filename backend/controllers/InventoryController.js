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
        supplierId: req.body.supplierId || existingItem.supplierId, // Update supplierId
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
      supplierId,
      expiryDate,
      dateReceived,
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
        supplierId,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        dateReceived: new Date(dateReceived),
        dateUpdated: new Date(), // Update the dateUpdated to the current timestamp
      },
    });

    // Ensure inventory-supplier mapping exists
    await ensureInventorySupplier(inventoryId, supplierId, pricePerUnit);

    // Save purchase details to the inventorypurchase table
    await prisma.inventorypurchase.create({
      data: {
        inventoryId,
        quantityBought: quantity,
        supplierId, // Update to supplierId
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
        supplierId: inventoryItem.supplierId, // Ensure supplierId is passed
        status: "Sent",
      },
    });

    console.log("Supplier order created:", newSupplierOrder);
    return newSupplierOrder;
  } catch (error) {
    console.error("Error creating supplier order:", error);
  }
};

// Fetch all supplier orders with inventory details and packageId
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
    // Extract name, description, and supplierId from the request body
    const { name, description, supplierId } = req.body;

    // Input validation
    if (!name || !description || !supplierId) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and supplierId are required",
      });
    }

    // Verify that the supplier exists
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    // Create a new package
    const newPackage = await prisma.inventoryPackage.create({
      data: {
        name,
        description,
        status: "New", // Default status
        supplierId, // Link the package to the supplier
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
    // Fetch all inventory packages
    const inventoryPackages = await prisma.inventoryPackage.findMany({
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
    const { packageId, dateReceived, expiryDate } = req.body;

    // Validate required fields
    if (!packageId || !dateReceived) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: packageId and dateReceived",
      });
    }

    // Fetch package details to get supplierId
    const packageDetails = await prisma.inventoryPackage.findUnique({
      where: { id: parseInt(packageId, 10) }, // Ensure packageId is an integer
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
      where: { packageId: parseInt(packageId, 10) }, // Ensure packageId is an integer
      select: {
        inventoryId: true,
        quantityOrdered: true,
        status: true,
        orderDate: true,
      },
    });

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Package contains no inventory items",
      });
    }

    // Group items by inventoryId and sum their quantities
    const aggregatedItems = orderItems.reduce((acc, item) => {
      const { inventoryId, quantityOrdered } = item;
      const inventoryKey = parseInt(inventoryId, 10); // Ensure inventoryId is an integer
      if (!acc[inventoryKey]) {
        acc[inventoryKey] = { quantityOrdered: 0 };
      }
      acc[inventoryKey].quantityOrdered += quantityOrdered;
      return acc;
    }, {});

    // Process each inventory item
    for (const inventoryId of Object.keys(aggregatedItems)) {
      const { quantityOrdered } = aggregatedItems[inventoryId];

      // Fetch the inventory item details
      const inventoryItem = await prisma.inventory.findUnique({
        where: { id: parseInt(inventoryId, 10) }, // Ensure inventoryId is an integer
        select: { quantity: true, pricePerUnit: true, initialQuantity: true },
      });

      if (!inventoryItem) {
        console.warn(
          `Inventory item with ID ${inventoryId} not found, skipping.`
        );
        continue;
      }

      const updatedQuantity = inventoryItem.quantity + quantityOrdered;

      // Update initialQuantity if updatedQuantity equals or exceeds it
      let updatedInitialQuantity = inventoryItem.initialQuantity;

      if (updatedQuantity >= updatedInitialQuantity) {
        updatedInitialQuantity = updatedQuantity;
      }

      // Update the inventory item
      await prisma.inventory.update({
        where: { id: parseInt(inventoryId, 10) },
        data: {
          quantity: updatedQuantity,
          initialQuantity: updatedInitialQuantity, // Update initial quantity
          pricePerUnit: inventoryItem.pricePerUnit,
          supplierId,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          dateReceived: new Date(dateReceived),
          dateUpdated: new Date(),
        },
      });

      // Ensure inventory-supplier mapping exists
      await ensureInventorySupplier(
        parseInt(inventoryId, 10),
        supplierId,
        inventoryItem.pricePerUnit
      );

      // Record purchase details in the inventorypurchase table
      await prisma.inventorypurchase.create({
        data: {
          inventoryId: parseInt(inventoryId, 10),
          quantityBought: quantityOrdered,
          supplierId,
          cost: quantityOrdered * inventoryItem.pricePerUnit,
          pricePerUnit: inventoryItem.pricePerUnit,
        },
      });

      // Update stock percentage in the status field
      await calculateStockPercentageAndStoreInStatus(parseInt(inventoryId, 10));
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Package items added successfully",
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
  getSupplierOrders,
  listInventory,
  listInventoryPackages,
  listSuppliers,
  logInventoryChange,
  removeFromPackage,
  removeInventory,
  removeSupplier,
  requestInventoryItem,
  updateInventory,
  updateInventoryAttributes,
  updateSupplier,
  withdrawItem,
};
