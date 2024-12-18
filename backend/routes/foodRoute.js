import express from "express";
import multer from "multer";
import {
  addFavorite,
  addFood,
  listFood,
  listMenuFood,
  rateFood,
  removeFavorite,
  removeFood,
  saveOrUpdateCustomization,
  updateFood,
} from "../controllers/foodController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/userAuth.js";

const foodRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", adminAuth, upload.single("image"), addFood);

foodRouter.get("/list", listFood);
foodRouter.get("/list-menu", listMenuFood);

foodRouter.post("/remove", adminAuth, removeFood);

foodRouter.post("/update", adminAuth, upload.single("image"), updateFood);

foodRouter.post("/rate-food", authUser, rateFood);
foodRouter.post("/add-favorite", authUser, addFavorite);
foodRouter.post("/remove-favorite", authUser, removeFavorite);
foodRouter.post("/save-customization", authUser, saveOrUpdateCustomization);

export default foodRouter;
