import express from "express";
import multer from "multer";
import {
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
} from "../controllers/drinkController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/userAuth.js";

const drinkRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

drinkRouter.post("/add", adminAuth, upload.single("image"), addDrink);

drinkRouter.get("/list", adminAuth, listDrinks);
drinkRouter.get("/list-menu", listMenuDrinks);

drinkRouter.post("/remove", adminAuth, removeDrink);
drinkRouter.post("/update", adminAuth, upload.single("image"), updateDrink);

drinkRouter.post("/rate-drink", authUser, rateDrink);
drinkRouter.post("/add-favorite", authUser, addDrinkFavorite);
drinkRouter.post("/remove-favorite", authUser, removeDrinkFavorite);
drinkRouter.post(
  "/save-customization",
  authUser,
  saveOrUpdateDrinkCustomization
);
drinkRouter.post("/remove-customization", authUser, deleteDrinkCustomization);

export default drinkRouter;
