import cors from "cors";
import "dotenv/config";
import express from "express";
import connectCloudinary from "./config/cloudinary.js";
import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import chefRouter from "./routes/chefRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import prismaRoute from "./routes/prismaRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();
connectCloudinary();

//api endpoints for Customer
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
//For Admin
app.use("/api/admin", adminRouter);
//for chef
app.use("/api/chef", chefRouter);

//-------------------------------Test Prisma route
app.use("/api/prisma", prismaRoute);
app.use("/emp", express.static("uploadsEmp"));

// Define the route
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
