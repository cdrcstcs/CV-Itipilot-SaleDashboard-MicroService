import Order from '../models/order.js';
import GeneralStat from '../models/GeneralStat.js'; // Adjust the path as per your file structure

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
export const calculateTotalSalesForOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    
    // Initialize objects to store totals
    const years = {};
    const months = {};
    const days = {};
    const yearArray = [];
    const monthArray = [];
    const dayArray = [];
    
    // Calculate totals by year, month, and day
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const year = orderDate.getFullYear();
      const month = orderDate.getMonth() + 1; // getMonth() returns 0-based index
      const day = orderDate.getDate();
      
      // Ensure unique years, months, and days
      if (!years[year]) {
        years[year] = 0;
        yearArray.push(year);
      }
      if (!months[month]) {
        months[month] = 0;
        monthArray.push(month);
      }
      if (!days[day]) {
        days[day] = 0;
        dayArray.push(day);
      }
      
      // Accumulate total sales
      years[year] += order.totalAmount; // Assuming order.totalAmount is the attribute for total sales
      months[month] += order.totalAmount;
      days[day] += order.totalAmount;
    });

    // Create GeneralStat document
    const stat = await GeneralStat.create({
      yearlyData: yearArray.map(y => ({
        year: y,
        totalSales: years[y]
      })),
      monthlyData: monthArray.map(m => ({
        month: m.toString(),
        totalSales: months[m]
      })),
      dailyData: dayArray.map(d => ({
        date: d.toString(),
        totalSales: days[d]
      }))
    });

    // Respond with created GeneralStat document
    res.status(200).json(stat);
  } catch (error) {
    console.error('Error calculating total sales:', error);
    res.status(500).json({ message: 'Failed to calculate total sales.' });
  }
};
