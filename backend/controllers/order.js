import Order from "../models/order.js";
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
function preprocessSales(sales) {
    sales = Object.keys(sales).sort();
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    const cumSum = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (!sales[dateString]) {
        sales[dateString] = 0;
        }
        if (!cumSum[year]) {
        cumSum[year] = [];
        }
        if (!cumSum[year][month]) {
        cumSum[year][month] = [];
        }
        cumSum[year][month][day] = sales[dateString] ? sales[dateString] : 0;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    for (let year = 0; year < cumSum.length; year++) {
        if (!cumSum[year]) continue;
        for (let month = 0; month < cumSum[year].length; month++) {
        if (!cumSum[year][month]) continue;
        for (let day = 1; day < cumSum[year][month].length; day++) {
            if (!cumSum[year][month][day]) continue;
            cumSum[year][month][day] += cumSum[year][month][day - 1];
        }
        }
    }
    return cumSum;
}
export const calculateTotalSalesForOrder = async (req,res) =>{
    const salesData = {};
    const orders = await Order.find();
    orders.forEach((order)=> {
        salesData[order.createdAt] = salesData[order.createdAt] ? salesData[order.createdAt] + order.totalAmount : 0; 
    })
    const cumSum = preprocessSales(salesData);
    res.status(200).json(cumSum);
}