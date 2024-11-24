import express from "express";
import multer from "multer";
import {
  addInventory,
  addStock,
  addSupplier,
  addToPackage,
  createPackage,
  getSupplierOrders,
  listInventory,
  listSuppliers,
  removeFromPackage,
  removeInventory,
  removeSupplier,
  requestInventoryItem,
  updateInventory,
  updateSupplier,
  withdrawItem,
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
  upload.single("image"),
  addInventory
);

inventoryRoute.get("/list-inventory", empAuth, listInventory);
inventoryRoute.post("/remove-inventory", empAuth, removeInventory);
inventoryRoute.post("/add-stock", empAuth, addStock);
inventoryRoute.post("/remove-stock", empAuth, withdrawItem);
inventoryRoute.get("/inv-orders", empAuth, getSupplierOrders);
inventoryRoute.post("/inv-request", empAuth, requestInventoryItem);
inventoryRoute.post(
  "/update-inventory",
  empAuth,
  upload.single("image"),
  updateInventory
);

inventoryRoute.post("/add-supplier", empAuth, addSupplier);
inventoryRoute.get("/list-suppliers", empAuth, listSuppliers);
inventoryRoute.post("/remove-supplier", empAuth, removeSupplier);
inventoryRoute.post("/update-supplier", empAuth, updateSupplier);

inventoryRoute.post("/add-package", addToPackage);
inventoryRoute.post("/remove-package", removeFromPackage);

inventoryRoute.post("/new-package", empAuth, createPackage);

export default inventoryRoute;
