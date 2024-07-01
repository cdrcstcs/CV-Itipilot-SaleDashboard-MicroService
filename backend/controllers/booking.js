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
    const endDate = new Date();  
    const startDate = new Date(endDate);  
    startDate.setFullYear(startDate.getFullYear() - 1);  
    const cumSum = {};
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (!sales[dateString]) {
            sales[dateString] = 0;
        }
        if(currentDate === startDate){
            cumSum[currentDate] = sales[dateString];
        }else{
            const prevDate = currentDate;
            prevDate.setDate(prevDate.getDate()-1);
            const prevyear = prevDate.getFullYear();
            const prevmonth = prevDate.getMonth();
            const prevday = prevDate.getDate();
            const prevdateString = `${prevyear}-${(prevmonth + 1).toString().padStart(2, '0')}-${prevday.toString().padStart(2, '0')}`;
            cumSum[dateString] = cumSum[prevdateString] + sales[dateString];
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return cumSum;
}
export const updateSumForBooking = async (req, res) =>{
    const bookings = await Booking.find();
    const salesData = {};
    bookings.forEach((booking)=> {
        salesData[booking.createdAt] = 0; 
    })
    bookings.forEach((booking)=> {
        salesData[booking.createdAt] += booking.price; 
    })
    const cumSum = preprocessSales(salesData);
    res.status(200).json(cumSum);
}
function sumOfSales(startDate, endDate, cumSum) {
    startDate.setDate(startDate.getDate()-1);
    const startYear = startDate.getFullYear();
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month and padding with zero if necessary
    const startDay = String(startDate.getDate()).padStart(2, '0'); 
    const startdateString = `${startYear}-${(startMonth + 1).toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month and padding with zero if necessary
    const endDay = String(endDate.getDate()).padStart(2, '0'); 
    const enddateString = `${endYear}-${(endMonth + 1).toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;
    return cumSum[enddateString]-cumSum[startdateString];
}
export const calculateTotalSalesForBooking = async (req,res) =>{
    const {startDate, endDate, cumSum} = req.body;
    res.status(200).json(sumOfSales(startDate, endDate, cumSum));
}