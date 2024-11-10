import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// Add food item
const addFood = async (req, res) => {
  try {
    const imageFilename = req.file ? req.file.filename : null;

    const food = await prisma.food.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        image: imageFilename,
      },
    });

    res.json({ success: true, message: "Food added", data: food });
  } catch (error) {
    console.error("Error adding food:", error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// List all food items for admin
const listFood = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        id: "desc", // Sorts by ID in descending order to show the latest items first
      },
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error retrieving food items:", error);
    res.json({ success: false, message: "Error retrieving food items" });
  }
};

// List food items with menuStatus set to true (for displaying available menu items)
const listMenuFood = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      where: {
        menuStatus: true, // Only select foods where menuStatus is true
      },
      orderBy: {
        id: "desc", // Optional: Sort by ID in descending order
      },
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error retrieving menu food items:", error);
    res.json({ success: false, message: "Error retrieving menu food items" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const foodId = parseInt(req.body.id, 10);
    if (isNaN(foodId)) {
      res.json({ success: false, message: "Invalid food ID" });
      return;
    }

    // Find the food item to get the image filename
    const food = await prisma.food.findUnique({
      where: { id: foodId },
    });

    if (!food) {
      res.json({ success: false, message: "Food item not found" });
      return;
    }

    // Delete the food item
    await prisma.food.delete({
      where: { id: foodId },
    });

    // Delete the associated image if it exists
    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (fsErr) => {
        if (fsErr) console.error("Error deleting image:", fsErr);
        res.json({ success: true, message: "Food removed" });
      });
    } else {
      res.json({ success: true, message: "Food removed" });
    }
  } catch (error) {
    console.log("Error removing food:", error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// Update food item including toggling menuStatus
const updateFood = async (req, res) => {
  try {
    const foodId = parseInt(req.body.id, 10);
    if (isNaN(foodId)) {
      res.json({ success: false, message: "Invalid food ID" });
      return;
    }

    // Find the food item to get the current image filename and menuStatus
    const existingFood = await prisma.food.findUnique({
      where: { id: foodId },
    });

    if (!existingFood) {
      res.json({ success: false, message: "Food item not found" });
      return;
    }

    // If a new image is uploaded, delete the old one and update the image filename
    let imageFilename = existingFood.image;
    if (req.file) {
      // Delete the old image if it exists
      if (existingFood.image) {
        fs.unlink(`uploads/${existingFood.image}`, (fsErr) => {
          if (fsErr) console.error("Error deleting old image:", fsErr);
        });
      }
      imageFilename = req.file.filename;
    }

    // Update menuStatus based on "1" or "0" (string) value from the request
    const menuStatus = req.body.menuStatus === "1";

    // Update the food item in the database
    const updatedFood = await prisma.food.update({
      where: { id: foodId },
      data: {
        name: req.body.name || existingFood.name,
        description: req.body.description || existingFood.description,
        price: req.body.price ? parseFloat(req.body.price) : existingFood.price,
        category: req.body.category || existingFood.category,
        image: imageFilename,
        menuStatus: menuStatus,
      },
    });

    res.json({ success: true, message: "Food updated", data: updatedFood });
  } catch (error) {
    console.error("Error updating food:", error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, listMenuFood, removeFood, updateFood };
