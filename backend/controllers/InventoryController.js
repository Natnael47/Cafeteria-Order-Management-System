import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// Add inventory item with image upload
const addInventory = async (req, res) => {
  try {
    const imageFilename = req.file ? req.file.filename : null;

    const inventoryItem = await prisma.inventory.create({
      data: {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description || null,
        quantity: req.body.quantity || 0,
        unit: req.body.unit,
        pricePerUnit: req.body.pricePerUnit
          ? parseFloat(req.body.pricePerUnit)
          : null,
        status: req.body.status,
        dateReceived: new Date(req.body.dateReceived),
        supplier: req.body.supplier || null,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
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
    res.json({ success: false, message: "Error adding inventory item" });
  }
};

// List all inventory items
const listInventory = async (req, res) => {
  try {
    const inventoryItems = await prisma.inventory.findMany({
      orderBy: {
        id: "desc",
      },
    });
    res.json({ success: true, data: inventoryItems });
  } catch (error) {
    console.error("Error retrieving inventory items:", error);
    res.json({ success: false, message: "Error retrieving inventory items" });
  }
};

// Remove inventory item and delete associated image
const removeInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10);
    if (isNaN(itemId)) {
      res.json({ success: false, message: "Invalid inventory item ID" });
      return;
    }

    const item = await prisma.inventory.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      res.json({ success: false, message: "Inventory item not found" });
      return;
    }

    // Delete inventory item from database
    await prisma.inventory.delete({
      where: { id: itemId },
    });

    // Delete the associated image if it exists
    if (item.image) {
      fs.unlink(`uploads/${item.image}`, (fsErr) => {
        if (fsErr) console.error("Error deleting image:", fsErr);
      });
    }

    res.json({ success: true, message: "Inventory item removed" });
  } catch (error) {
    console.error("Error removing inventory item:", error);
    res.json({ success: false, message: "Error removing inventory item" });
  }
};

// Update inventory item, including image management
const updateInventory = async (req, res) => {
  try {
    const itemId = parseInt(req.body.id, 10);
    if (isNaN(itemId)) {
      res.json({ success: false, message: "Invalid inventory item ID" });
      return;
    }

    const existingItem = await prisma.inventory.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      res.json({ success: false, message: "Inventory item not found" });
      return;
    }

    // Handle image update: delete old image and set new image filename if uploaded
    let imageFilename = existingItem.image;
    if (req.file) {
      if (existingItem.image) {
        fs.unlink(`uploads/${existingItem.image}`, (fsErr) => {
          if (fsErr) console.error("Error deleting old image:", fsErr);
        });
      }
      imageFilename = req.file.filename;
    }

    // Update the inventory item in the database
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
    res.json({ success: false, message: "Error updating inventory item" });
  }
};

export { addInventory, listInventory, removeInventory, updateInventory };
