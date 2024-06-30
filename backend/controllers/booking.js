import Booking from '../models/booking';
import GeneralStat from '../models/GeneralStat'; // Adjust the path as per your file structure
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

export const calculateTotalSalesForBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const years = {};
    const months = {};
    const days = {};
    const yearArray = [];
    const monthArray = [];
    const dayArray = [];
    
    // Calculate totals by year, month, and day
    bookings.forEach(booking => {
      const year = booking.createdAt.getFullYear();
      const month = booking.createdAt.getMonth() + 1; // getMonth() returns 0-based index
      const day = booking.createdAt.getDate();
      
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
      years[year] += booking.price;
      months[month] += booking.price;
      days[day] += booking.price;
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
