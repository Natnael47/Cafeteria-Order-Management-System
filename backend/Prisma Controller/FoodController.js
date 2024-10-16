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

export { addFood, listFood, removeFood };
