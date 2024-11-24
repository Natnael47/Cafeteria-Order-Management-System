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
      totalPrice: order.quantityOrdered * (order.inventory.pricePerUnit || 0),
      orderDate: order.orderDate,
      supplierId: order.supplierId, // Ensure supplierId is included
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

const newPackage = async (req, res) => {
  try {
    const { name, description, orderIds } = req.body;

    // Validate input
    if (
      !name ||
      !description ||
      !Array.isArray(orderIds) ||
      orderIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and order IDs are required",
      });
    }

    // Fetch supplier ID and inventory ID from the order IDs
    const supplierOrders = await prisma.supplierorder.findMany({
      where: { id: { in: orderIds } },
      select: { supplierId: true, inventoryId: true },
    });

    // Ensure all orders have the same supplierId
    const supplierIds = [
      ...new Set(supplierOrders.map((order) => order.supplierId)),
    ];
    if (supplierIds.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Orders must belong to the same supplier to create a package",
      });
    }

    const supplierId = supplierIds[0];
    const inventoryIds = supplierOrders.map((order) => order.inventoryId);

    // Fetch inventory details to get the price per unit
    const inventoryItems = await prisma.inventory.findMany({
      where: { id: { in: inventoryIds } },
      select: { id: true, pricePerUnit: true },
    });

    // If there are no inventory items, return an error
    if (inventoryItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No inventory items found for the specified orders",
      });
    }

    // Create the package with the first item's pricePerUnit (assuming uniform price)
    const packageQuantity = orderIds.length; // Example: quantity equals the number of orders
    const pricePerUnit =
      inventoryItems.length > 0 ? inventoryItems[0].pricePerUnit : 0;
    const totalCost = packageQuantity * pricePerUnit;

    // Create new packageInventory entry with a connect operation for the inventory and create operation for inventoryPackage
    const newPackage = await prisma.packageInventory.create({
      data: {
        quantity: packageQuantity, // Dynamic quantity based on order count
        pricePerUnit: pricePerUnit, // Price per unit from inventory
        totalCost: totalCost, // Total cost calculated dynamically
        inventory: {
          connect: { id: inventoryIds[0] }, // Connect the first inventory item
        },
        inventoryPackage: {
          create: {
            name: name, // Use the provided package name
            description: description, // Use the provided package description
            supplierId: supplierId, // Use the supplier ID from orders
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("Error in newPackage:", error);
    return res.status(500).json({
      success: false,
      message: `Error in newPackage: ${error.message}`,
    });
  }
};

const addToPackage = async (req, res) => {
  try {
    const { packageId, orderId, quantity } = req.body;

    // Validate input
    if (!packageId || !orderId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Package ID, order ID, and quantity are required",
      });
    }

    // Fetch the existing package and its supplierId
    const existingPackage = await prisma.inventoryPackage.findUnique({
      where: { id: packageId },
      select: { id: true, supplierId: true },
    });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Fetch the supplierId of the order
    const supplierOrder = await prisma.supplierorder.findUnique({
      where: { id: orderId },
      select: { supplierId: true },
    });

    if (!supplierOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Ensure the supplierId of the order matches the package's supplierId
    if (existingPackage.supplierId !== supplierOrder.supplierId) {
      return res.status(400).json({
        success: false,
        message: "Supplier IDs do not match, cannot add to package",
      });
    }

    // Add the order to the packageInventory with quantity
    const packageInventoryEntry = await prisma.packageInventory.create({
      data: {
        inventoryPackageId: packageId,
        orderId: orderId, // Add the order to the package
        quantity: quantity, // Include the quantity of the order being added
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order added to package successfully",
      packageInventoryEntry,
    });
  } catch (error) {
    console.error("Error in addToPackage:", error);
    return res.status(500).json({
      success: false,
      message: `Error in addToPackage: ${error.message}`,
    });
  }
};

const removeFromPackage = async (req, res) => {
  try {
    const { packageId, supplierOrderId } = req.body;

    if (!packageId || !supplierOrderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: packageId or supplierOrderId",
      });
    }

    // Delete the item from the package
    await prisma.packageInventoryItem.deleteMany({
      where: {
        packageId,
        supplierOrderId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from package successfully",
    });
  } catch (error) {
    console.error("Error in removeFromPackage:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Export all functions
export {
  addInventory,
  addInventoryBulk,
  addStock,
  addSupplier,
  addToPackage,
  calculateStockPercentageAndStoreInStatus,
  checkInventoryThreshold,
  generateReport,
  generateUsageReport,
  getSupplierOrders,
  listInventory,
  listSuppliers,
  logInventoryChange,
  newPackage,
  removeFromPackage,
  removeInventory,
  removeSupplier,
  requestInventoryItem,
  updateInventory,
  updateInventoryAttributes,
  updateSupplier,
  withdrawItem,
};
