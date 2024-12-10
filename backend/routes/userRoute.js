import express from "express";
import {
  allUsers,
  changePassword,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post("/update-profile", authUser, updateUserProfile);

userRouter.get("/all-users", adminAuth, allUsers);
userRouter.post("/change-password", authUser, changePassword);

export default userRouter;
