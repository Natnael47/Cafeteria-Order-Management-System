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

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await prisma.food.findMany();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error retrieving food items:", error);
    res.json({ success: false, message: "Error retrieving food items" });
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

// Update food item
const updateFood = async (req, res) => {
  try {
    const foodId = parseInt(req.body.id, 10);
    if (isNaN(foodId)) {
      res.json({ success: false, message: "Invalid food ID" });
      return;
    }

    // Find the food item to get the current image filename
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

    // Update the food item
    const updatedFood = await prisma.food.update({
      where: { id: foodId },
      data: {
        name: req.body.name || existingFood.name,
        description: req.body.description || existingFood.description,
        price: req.body.price ? parseFloat(req.body.price) : existingFood.price,
        category: req.body.category || existingFood.category,
        image: imageFilename,
      },
    });

    res.json({ success: true, message: "Food updated", data: updatedFood });
  } catch (error) {
    console.error("Error updating food:", error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, updateFood };
