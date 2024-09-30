import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const adminDashboard = async (req, res) => {
  try {
    const users = await userModel.find({});
    const orders = await orderModel.find({});

    const dashData = {
      users: users.length,
      orders: orders.length,
      latestOrders: orders.reverse().slice(0, 5),
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { adminDashboard, adminLogin };
