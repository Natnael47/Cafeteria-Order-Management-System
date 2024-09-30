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

export { adminDashboard };
