import mongoose from "mongoose";
const {Schema} = mongoose;
const UserSchema = new Schema({
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
const User = mongoose.model('User', UserSchema);
export default User;
