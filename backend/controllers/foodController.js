import fs from "fs";
import mysql from "mysql2";

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "23@user!23",
  database: "nodejs",
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MYSQL database.");

  // SQL query to create the food table with specified attributes
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS food (
      _id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      image VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL
    )
  `;

  // Execute the create table query
  connection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
      connection.end();
      return;
    }
    console.log('Table "food" created');
  });
});

// Add food item
const addFood = (req, res) => {
  const image_filename = req.file ? req.file.filename : null;

  const food = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  };

  const query = "INSERT INTO food SET ?";

  connection.query(query, food, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ success: false, message: "Error adding food" });
      return;
    }
    res.json({ success: true, message: "Food added" });
  });
};

// List all food items
const listFood = (req, res) => {
  const query = "SELECT * FROM food";

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.json({ success: false, message: "Error retrieving food items" });
      return;
    }
    res.json({ success: true, data: results });
  });
};

// Remove food item
// Remove food item
const removeFood = (req, res) => {
  console.log("Request body:", req.body); // Check the complete request body

  // Parse and validate food ID
  const foodId = req.body.id ? parseInt(req.body.id, 10) : NaN;
  console.log("Parsed foodId:", foodId); // Debugging line

  if (isNaN(foodId)) {
    console.log("Invalid food ID:", req.body.id);
    res.json({ success: false, message: "Invalid food ID" });
    return;
  }

  console.log("Attempting to remove food with ID:", foodId);

  // Fetch the food item to get the image filename
  connection.query(
    "SELECT * FROM food WHERE _id = ?",
    [foodId],
    (err, results) => {
      if (err) {
        console.log("Database query error:", err);
        res.json({ success: false, message: "Error retrieving food item" });
        return;
      }

      console.log("Query results:", results);

      if (results.length === 0) {
        console.log("No food item found with ID:", foodId);
        res.json({ success: false, message: "Food item not found" });
        return;
      }

      const food = results[0];
      console.log("Found food item:", food);

      // Delete the food item from the database
      connection.query(
        "DELETE FROM food WHERE _id = ?",
        [foodId],
        (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.log("Error removing food:", deleteErr);
            res.json({ success: false, message: "Error removing food" });
            return;
          }

          console.log("Food item deleted from database:", deleteResult);

          // Delete the associated image if it exists
          if (food.image) {
            const imagePath = `uploads/${food.image}`;
            console.log("Attempting to delete image at:", imagePath);

            fs.unlink(imagePath, (fsErr) => {
              if (fsErr) {
                console.log("Error deleting image:", fsErr);
                res.json({
                  success: true,
                  message: "Food removed, but image could not be deleted",
                });
                return;
              }

              console.log("Image deleted successfully:", imagePath);
              res.json({
                success: true,
                message: "Food removed and image deleted",
              });
            });
          } else {
            console.log(
              "No image found for food item. Skipping image deletion."
            );
            res.json({ success: true, message: "Food removed" });
          }
        }
      );
    }
  );
};

export { addFood, listFood, removeFood };
