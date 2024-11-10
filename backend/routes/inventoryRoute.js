import express from "express";
import multer from "multer";
import {
  addInventory,
  listInventory,
  removeInventory,
  updateInventory,
} from "../controllers/InventoryController.js";
import empAuth from "../middleware/empAuth.js";

const inventoryRoute = express.Router();

//Image storage engine
const storage = multer.diskStorage({
  destination: "upload_inv",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

inventoryRoute.post(
  "/add-inventory",
  empAuth,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next(); // If no error, proceed to the controller
    });
  },
  addInventory
);

inventoryRoute.get("/list-inventory", empAuth, listInventory);
inventoryRoute.post("/remove-inventory", empAuth, removeInventory);
inventoryRoute.post(
  "/update-inventory",
  empAuth,
  upload.single("image"),
  updateInventory
);

export default inventoryRoute;
