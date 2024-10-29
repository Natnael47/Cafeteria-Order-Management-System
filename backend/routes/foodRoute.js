import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";
import adminAuth from "../middleware/adminAuth.js";

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

foodRouter.post("/remove", adminAuth, removeFood);

foodRouter.post("/update", adminAuth, upload.single("image"), updateFood);

export default foodRouter;
