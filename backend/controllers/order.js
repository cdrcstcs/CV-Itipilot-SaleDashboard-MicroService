import Order from "../models/order.js";
import OrderStat from "../models/GeneralStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
export const getOrders = async (req, res) => {
  try {
    const Orders = await Order.find();
    const OrdersWithStats = await Promise.all(
      Orders.map(async (Order) => {
        const stat = await OrderStat.find({
          OrderId: Order._id,
        });
        return {
          ...Order._doc,
          stat,
        };
      })
    );
    res.status(200).json(OrdersWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
