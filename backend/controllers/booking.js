import Booking from "../models/booking.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};


export const updateSumForBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const salesData = {};

    bookings.forEach((booking) => {
      // Assuming booking.createdAt is a Date object
      const createdAtString = formatDate(booking.createdAt); // Format createdAt as string
      salesData[createdAtString] = salesData[createdAtString] || 0;
      salesData[createdAtString] += booking.price;
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