import cors from "cors";
import "dotenv/config";
import express from "express";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import feedBackRoute from "./routes/feedBackRoute.js";
import foodRouter from "./routes/foodRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//db connection
//connectDB();
//connectCloudinary();

//api endpoints for Customer
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/empIMG", express.static("uploadsEmp"));
app.use("/Inv_img", express.static("upload_inv"));
//API For USERS
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
//API For Orders
app.use("/api/order", orderRouter);
//For Admin
app.use("/api/admin", adminRouter);
//API For Employees
app.use("/api/employee", employeeRoute);
//API For Feedback
app.use("/api/feedback", feedBackRoute);
//API for Inventory
app.use("/api/inventory", inventoryRoute);

// Define the route
app.get("/", (req, res) => {
  res.send("API is Working");
});

// Start the server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
