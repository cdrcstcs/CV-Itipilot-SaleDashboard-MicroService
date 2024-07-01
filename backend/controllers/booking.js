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
function sumOfSales(startDate, endDate, totals) {
    const { cumSum } = totals;
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    const sum = cumSum[endYear][endMonth][endDay];
    if (startDay > 0) {
        sum -= cumSum[startYear][startMonth][startDay - 1];
    }
    if (startMonth > 0) {
        sum -= cumSum[startYear][startMonth - 1][cumSum[startYear][startMonth - 1].length - 1];
    }
    if (startYear > 0) {
        sum -= cumSum[startYear - 1][cumSum[startYear - 1].length - 1][cumSum[startYear - 1][cumSum[startYear - 1].length - 1].length - 1];
    }
    return sum;
}
export const calculateTotalSalesForBooking = async (req,res) =>{
    const salesData = {};
    const bookings = await Booking.find();
    bookings.forEach((booking)=> {
        salesData[booking.createdAt] = salesData[booking.createdAt] ? salesData[booking.createdAt] + booking.price : 0; 
    })
    const cumSum = preprocessSales(salesData);
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const total = sumOfSales(startDate, endDate, { cumSum });
    res.status(200).json(total);
}