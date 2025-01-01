import express from "express";
import {
  allUsers,
  changePassword,
  getUserDrinkDetails,
  getUserFavoritesAndCustomizations,
  getUserProfile,
  loginUser,
  passwordRecovery,
  registerUser,
  resetPassword,
  updateAccountStatus,
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
userRouter.post("/update-account-status", adminAuth, updateAccountStatus);

userRouter.get("/get-favorite", authUser, getUserFavoritesAndCustomizations);
userRouter.get("/get-drink-details", authUser, getUserDrinkDetails);

userRouter.post("/password-recovery", passwordRecovery);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
