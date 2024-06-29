import Order from "../models/order.js";
import GeneralStat from "../models/GeneralStat.js";
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const ordersWithStats = await Promise.all(orders.map(async (order) => {
        const stat = await GeneralStat.find({productId: order._id});
        return {
          ...order._doc,
          stat,
        };
      })
    );
    res.status(200).json(ordersWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
