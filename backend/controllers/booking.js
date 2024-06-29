import Booking from "../models/booking.js";
import GeneralStat from "../models/GeneralStat.js";
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const bookingsWithStats = await Promise.all(bookings.map(async (booking) => {
        const stat = await GeneralStat.find({
          productId: booking._id,
        });
        return {
          ...booking._doc,
          stat,
        };
      })
    );
    res.status(200).json(bookingsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
