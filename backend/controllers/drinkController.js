import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// Add drink item
const addDrink = async (req, res) => {
  try {
    const imageFilename = req.file ? req.file.filename : null;

    const drink = await prisma.drink.create({
      data: {
        drink_Name: req.body.name,
        drink_Description: req.body.description,
        drink_Price: parseFloat(req.body.price),
        drink_Category: req.body.category,
        drink_Image: imageFilename,
        is_Alcoholic: req.body.isAlcoholic === "true",
        drink_Size: req.body.size || null,
      },
    });

    res.json({ success: true, message: "Drink added", data: drink });
  } catch (error) {
    console.error("Error adding drink:", error);
    res.json({ success: false, message: "Error adding drink" });
  }
};

// List all drink items for admin
const listDrinks = async (req, res) => {
  try {
    const drinks = await prisma.drink.findMany({
      orderBy: {
        drink_Id: "desc", // Sorts by ID in descending order to show the latest items first
      },
    });
    res.json({ success: true, data: drinks });
  } catch (error) {
    console.error("Error retrieving drinks:", error);
    res.json({ success: false, message: "Error retrieving drinks" });
  }
};

// List drink items with menu_Status set to true (for displaying available menu items)
const listMenuDrinks = async (req, res) => {
  try {
    const drinks = await prisma.drink.findMany({
      where: {
        menu_Status: true, // Only select drinks where menu_Status is true
      },
      orderBy: {
        drink_Id: "desc", // Optional: Sort by ID in descending order
      },
    });
    res.json({ success: true, data: drinks });
  } catch (error) {
    console.error("Error retrieving menu drinks:", error);
    res.json({ success: false, message: "Error retrieving menu drinks" });
  }
};

// Remove drink item
const removeDrink = async (req, res) => {
  try {
    const drinkId = parseInt(req.body.id, 10);
    if (isNaN(drinkId)) {
      res.json({ success: false, message: "Invalid drink ID" });
      return;
    }

    // Find the drink item to get the image filename
    const drink = await prisma.drink.findUnique({
      where: { drink_Id: drinkId },
    });

    if (!drink) {
      res.json({ success: false, message: "Drink item not found" });
      return;
    }

    // Delete the drink item
    await prisma.drink.delete({
      where: { drink_Id: drinkId },
    });

    // Delete the associated image if it exists
    if (drink.drink_Image) {
      fs.unlink(`uploads2/${drink.drink_Image}`, (fsErr) => {
        if (fsErr) console.error("Error deleting image:", fsErr);
        res.json({ success: true, message: "Drink removed" });
      });
    } else {
      res.json({ success: true, message: "Drink removed" });
    }
  } catch (error) {
    console.error("Error removing drink:", error);
    res.json({ success: false, message: "Error removing drink" });
  }
};

// Update drink item
const updateDrink = async (req, res) => {
  try {
    const drinkId = parseInt(req.body.id, 10);
    if (isNaN(drinkId)) {
      res.json({ success: false, message: "Invalid drink ID" });
      return;
    }

    // Find the drink item to get the current image filename
    const existingDrink = await prisma.drink.findUnique({
      where: { drink_Id: drinkId },
    });

    if (!existingDrink) {
      res.json({ success: false, message: "Drink item not found" });
      return;
    }

    // If a new image is uploaded, delete the old one and update the image filename
    let imageFilename = existingDrink.drink_Image;
    if (req.file) {
      if (existingDrink.drink_Image) {
        fs.unlink(`uploads2/${existingDrink.drink_Image}`, (fsErr) => {
          if (fsErr) console.error("Error deleting old image:", fsErr);
        });
      }
      imageFilename = req.file.filename;
    }

    // Update the drink item in the database
    const updatedDrink = await prisma.drink.update({
      where: { drink_Id: drinkId },
      data: {
        drink_Name: req.body.name || existingDrink.drink_Name,
        drink_Description:
          req.body.description || existingDrink.drink_Description,
        drink_Price: req.body.price
          ? parseFloat(req.body.price)
          : existingDrink.drink_Price,
        drink_Category: req.body.category || existingDrink.drink_Category,
        drink_Image: imageFilename,
        is_Alcoholic:
          req.body.isAlcoholic !== undefined
            ? req.body.isAlcoholic === "true"
            : existingDrink.is_Alcoholic,
        drink_Size: req.body.size || existingDrink.drink_Size,
        menu_Status:
          req.body.menuStatus !== undefined
            ? req.body.menuStatus === "1"
            : existingDrink.menu_Status,
      },
    });

    res.json({ success: true, message: "Drink updated", data: updatedDrink });
  } catch (error) {
    console.error("Error updating drink:", error);
    res.json({ success: false, message: "Error updating drink" });
  }
};

// Rate drink
const rateDrink = async (req, res) => {
  try {
    const { userId, drinkId, rating } = req.body;

    if (!userId || !drinkId || rating == null) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const parsedRating = parseFloat(rating);

    const existingRating = await prisma.rating.findFirst({
      where: { userId: parseInt(userId), drinkId: parseInt(drinkId) },
    });

    if (existingRating) {
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating: parsedRating },
      });
    } else {
      await prisma.rating.create({
        data: {
          userId: parseInt(userId),
          drinkId: parseInt(drinkId),
          rating: parsedRating,
        },
      });
    }

    const averageRating = await prisma.rating.aggregate({
      _avg: { rating: true },
      where: { drinkId: parseInt(drinkId) },
    });

    const updatedDrink = await prisma.drink.update({
      where: { drink_Id: parseInt(drinkId) },
      data: { average_Rating: averageRating._avg.rating || 0 },
    });

    res.json({
      success: true,
      message: "Drink rated successfully",
      data: updatedDrink,
    });
  } catch (error) {
    console.error("Error rating drink:", error);
    res.json({ success: false, message: "Error rating drink" });
  }
};

export {
  addDrink,
  listDrinks,
  listMenuDrinks,
  rateDrink,
  removeDrink,
  updateDrink,
};
