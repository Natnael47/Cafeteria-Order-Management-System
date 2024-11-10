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
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

inventoryRoute.post(
  "/add-inventory",
  empAuth,
  upload.single("image"),
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
