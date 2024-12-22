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
      fs.unlink(`uploads/${drink.drink_Image}`, (fsErr) => {
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
        fs.unlink(`uploads/${existingDrink.drink_Image}`, (fsErr) => {
          if (fsErr) console.error("Error deleting old image:", fsErr);
        });
      }
      imageFilename = req.file.filename;
    }

    // Update the drink item in the database
    const updatedDrink = await prisma.drink.update({
      where: { drink_Id: drinkId },
      data: {
        drink_Name: req.body.drink_Name || existingDrink.drink_Name,
        drink_Description:
          req.body.drink_Description || existingDrink.drink_Description,
        drink_Price: req.body.drink_Price
          ? parseFloat(req.body.drink_Price)
          : existingDrink.drink_Price,
        drink_Category: req.body.drink_Category || existingDrink.drink_Category,
        drink_Image: imageFilename,
        is_Alcoholic:
          req.body.is_Alcoholic !== undefined
            ? req.body.is_Alcoholic === "true"
            : existingDrink.is_Alcoholic,
        drink_Size: req.body.drink_Size || existingDrink.drink_Size,
        menu_Status:
          req.body.menu_Status !== undefined
            ? req.body.menu_Status === "1"
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

    // Check if the user has already rated this drink
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: parseInt(userId),
        drinkId: parseInt(drinkId),
      },
    });

    if (existingRating) {
      // Update the existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating: parsedRating },
      });
    } else {
      // Create a new rating for the drink
      await prisma.rating.create({
        data: {
          userId: parseInt(userId),
          drinkId: parseInt(drinkId),
          rating: parsedRating,
        },
      });
    }

    // Calculate the new average rating for the drink
    const averageRating = await prisma.rating.aggregate({
      _avg: { rating: true },
      where: { drinkId: parseInt(drinkId) },
    });

    // Update the drink's average rating
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

// Save or Update Drink Customization
const saveOrUpdateDrinkCustomization = async (req, res) => {
  try {
    const { userId, drinkId, customNote } = req.body;

    // Validate input
    if (!userId || !drinkId || !customNote) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check if a customization already exists for the user and drink
    const existingCustomization = await prisma.drinkCustomization.findFirst({
      where: {
        userId: parseInt(userId),
        drinkId: parseInt(drinkId),
      },
    });

    let customization;
    if (existingCustomization) {
      // Update the existing customization
      customization = await prisma.drinkCustomization.update({
        where: { id: existingCustomization.id },
        data: { customNote },
      });
      res.json({
        success: true,
        message: "Drink customization updated successfully",
        data: customization,
      });
    } else {
      // Create a new customization
      customization = await prisma.drinkCustomization.create({
        data: {
          userId: parseInt(userId),
          drinkId: parseInt(drinkId),
          customNote,
        },
      });
      res.json({
        success: true,
        message: "Drink customization saved successfully",
        data: customization,
      });
    }
  } catch (error) {
    console.error("Error saving or updating drink customization:", error);
    res.json({
      success: false,
      message: "Error saving or updating drink customization",
    });
  }
};

// Delete Drink Customization
const deleteDrinkCustomization = async (req, res) => {
  try {
    const { userId, drinkId } = req.body;

    // Validate input
    if (!userId || !drinkId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Check if a customization exists for the user and drink
    const existingCustomization = await prisma.drinkCustomization.findFirst({
      where: {
        userId: parseInt(userId),
        drinkId: parseInt(drinkId),
      },
    });

    if (!existingCustomization) {
      return res.json({
        success: false,
        message: "No customization found for this user and drink",
      });
    }

    // Delete the customization
    await prisma.drinkCustomization.delete({
      where: { id: existingCustomization.id },
    });

    res.json({
      success: true,
      message: "Drink customization deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting drink customization:", error);
    res.json({
      success: false,
      message: "Error deleting drink customization",
    });
  }
};

// Add Drink to Favorites
const addDrinkFavorite = async (req, res) => {
  try {
    const { userId, drinkId } = req.body;

    // Validate input
    if (!userId || !drinkId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        drinkId: parseInt(drinkId),
      },
    });

    res.json({
      success: true,
      message: "Drink added to favorites",
      data: favorite,
    });
  } catch (error) {
    console.error("Error adding drink to favorites:", error);
    res.json({ success: false, message: "Error adding drink to favorites" });
  }
};

// Remove Drink from Favorites
const removeDrinkFavorite = async (req, res) => {
  try {
    const { userId, drinkId } = req.body;

    // Validate input
    if (!userId || !drinkId) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Find the favorite record
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        drinkId: parseInt(drinkId),
      },
    });

    if (!favorite) {
      return res.json({
        success: false,
        message: "Favorite record not found",
      });
    }

    // Delete the favorite record
    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    res.json({ success: true, message: "Drink removed from favorites" });
  } catch (error) {
    console.error("Error removing drink from favorites:", error);
    res.json({
      success: false,
      message: "Error removing drink from favorites",
    });
  }
};

export {
  addDrink,
  addDrinkFavorite,
  deleteDrinkCustomization,
  listDrinks,
  listMenuDrinks,
  rateDrink,
  removeDrink,
  removeDrinkFavorite,
  saveOrUpdateDrinkCustomization,
  updateDrink,
};
