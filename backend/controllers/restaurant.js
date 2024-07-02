import Restaurant from "../models/Restaurant.js";
export const getAllRestaurants = async (req, res) => {
  try {
    const Restaurants = await Restaurant.find();
    res.status(200).json(Restaurants);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};


export const updateSumForRestaurant = async (req, res) => {
  try {
    const Restaurants = await Restaurant.find();
    const salesData = {};

    Restaurants.forEach((Restaurant) => {
      // Assuming Restaurant.lastUpdated is a Date object
      const lastUpdatedString = formatDate(Restaurant.lastUpdated); // Format lastUpdated as string
      salesData[lastUpdatedString] = salesData[lastUpdatedString] || 0;
      salesData[lastUpdatedString] += Restaurant.deliveryPrice;
    });

    const cumSum = preprocessSales(salesData);
    console.log('Cumulative Sum:', cumSum); // Log cumulative sum for debugging

    res.status(200).json(cumSum);
  } catch (error) {
    console.error('Error updating sum for bookings:', error);
    res.status(500).json({ message: 'Failed to update sum for bookings' });
  }
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

  console.log('Processed Sales Data:', sales); // Log processed sales data for debugging
  console.log('Cumulative Sum:', cumSum); // Log cumulative sum for debugging

  return cumSum;
}