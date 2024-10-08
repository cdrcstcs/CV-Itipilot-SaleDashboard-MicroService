import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Order from "./models/order.js";
import Booking from "./models/booking.js";
import Restaurant from "./models/Restaurant.js";
import Hotel from "./models/Hotel.js";
import { getAllBookings, updateSumForBooking } from "./controllers/booking.js";
import { getAllOrders, updateSumForOrder } from "./controllers/Order.js";
import { getAllRestaurants, updateSumForRestaurant } from "./controllers/restaurant.js";
import { getGeography } from "./controllers/Geography.js";
import { getUser, getCustomers, getAdmins } from "./controllers/User.js";
import jwt from "jsonwebtoken";
import { bookings, usersWithAbbreviations, orders, restaurantsWithAbbreviations, hotels } from "./data.js";
import { getAllHotels } from "./controllers/hotels.js";
import User from "./models/User.js";
import 'dotenv/config';
async function verifyToken(req, res) {
  try {
      console.log(req.body);
      const token = req.body.token;
      if (!token) {
          throw new Error('No token provided');
      }
      const userData = await new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(decoded);
              }
          });
      });
      res.status(200).json(userData);
  } catch (err) {
      res.status(401).json(err.message || 'Unauthorized');
  }
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    credentials: true,
    origin: true,
}));
app.get("/bsum", updateSumForBooking);
app.get("/osum", updateSumForOrder);
app.get("/rsum", updateSumForRestaurant);
app.get("/geography", getGeography);
app.get("/user/:id", getUser);
app.post("/token", verifyToken);
app.get("/admins", getAdmins);
app.get("/customers", getCustomers);
app.get("/blist",getAllBookings);
app.get("/olist",getAllOrders);
app.get("/rlist",getAllRestaurants);
app.get("/hlist",getAllHotels);
mongoose.connect(process.env.MONGO_URL).then(async () => {
    await Restaurant.deleteMany();
    await Booking.deleteMany(); // Clear existing data
    await Order.deleteMany(); // Clear existing data
    await User.deleteMany();
    await Hotel.deleteMany();
    await Booking.insertMany(bookings);
    await Order.insertMany(orders);
    await User.insertMany(usersWithAbbreviations);
    await Restaurant.insertMany(restaurantsWithAbbreviations);
    await Hotel.insertMany(hotels);
    app.listen(process.env.PORT, () => console.log(`Server running on PORT: ${process.env.PORT}`));
}).catch((error) => console.log(`${error} did not connect`));