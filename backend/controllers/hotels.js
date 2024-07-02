import Hotel from "../models/Hotel.js";
export const getAllHotels = async (req, res) => {
  try {
    const Hotels = await Hotel.find();
    res.status(200).json(Hotels);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};