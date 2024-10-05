import orderModel from "../models/orderModel.js";

const chefDashboard = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    const dashData = {
      latestOrders: orders.reverse(),
    };

    res.json({ success: true, data: dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { chefDashboard };
