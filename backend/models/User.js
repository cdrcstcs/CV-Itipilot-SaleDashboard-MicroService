import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' }, 
  name: String,
  email: {type:String, unique:true},
  password: String,
  country: String,
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }], 
  phone: Number,
  userType: String,
  longtitude: Number,
  latitude: Number, 
},{timestamps:true});
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
