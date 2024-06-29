import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  price: Number,
  address: String,
  city: String,
  bedroom: Number,
  bathroom: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now },
});
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
