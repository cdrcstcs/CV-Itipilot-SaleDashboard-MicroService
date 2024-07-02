import Order from "../models/order.js";

// Function to format date as YYYY-MM-DD string
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to preprocess sales data and calculate cumulative sums
function preprocessSales(sales) {
  const endDate = new Date('2024-01-01');
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const cumSum = {};
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = formatDate(currentDate);

    if (!sales[dateString]) {
      sales[dateString] = 0;
    }

    if (currentDate.getTime() === startDate.getTime()) {
      cumSum[dateString] = sales[dateString];
    } else {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateString = formatDate(prevDate);
      cumSum[dateString] = cumSum[prevDateString] + sales[dateString];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return cumSum;
}


// Function to fetch all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Function to update cumulative sum for orders
export const updateSumForOrder = async (req, res) => {
  try {
    const orders = await Order.find();
    const salesData = {};

    orders.forEach((order) => {
      const createdAtString = formatDate(order.createdAt);
      salesData[createdAtString] = salesData[createdAtString] || 0;
      salesData[createdAtString] += order.totalAmount;
    });

    const cumSum = preprocessSales(salesData);
    res.status(200).json(cumSum);
  } catch (error) {
    console.error('Error updating sum for orders:', error);
    res.status(500).json({ message: 'Failed to update sum for orders' });
  }
};

