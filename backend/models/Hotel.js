import mongoose from "mongoose";
const hotelSchema = new mongoose.Schema({
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }, 
  price: Number,
  address: String,
  city: String,
  bedroom: Number,
  bathroom: Number,
  country: String, 
  latitude: String,
  longtitude: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});
const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
