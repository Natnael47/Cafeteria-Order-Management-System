import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post("/update-profile", authUser, updateUserProfile);

export default userRouter;
