import Booking from "../models/booking.js";
import BookingStat from "../models/GeneralStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
export const getBookings = async (req, res) => {
  try {
    const Bookings = await Booking.find();
    const BookingsWithStats = await Promise.all(
      Bookings.map(async (Booking) => {
        const stat = await BookingStat.find({
          BookingId: Booking._id,
        });
        return {
          ...Booking._doc,
          stat,
        };
      })
    );
    res.status(200).json(BookingsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
