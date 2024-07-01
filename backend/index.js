import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Order from "./models/order.js";
import Booking from "./models/booking.js";
import { calculateTotalSalesForBooking, getAllBookings } from "./controllers/booking.js";
import { calculateTotalSalesForOrder, getAllOrders } from "./controllers/Order.js";
import { getGeography } from "./controllers/Geography.js";
import { getUser, getCustomers, getAdmins } from "./controllers/User.js";
import jwt from "jsonwebtoken";
import { bookings, users, orders } from "./data.js";
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
import User from "./models/User.js";
async function verifyToken(req, res) {
  try {
      console.log(req.body);
      const token = req.body.token;
      if (!token) {
          throw new Error('No token provided');
      }
      const userData = await new Promise((resolve, reject) => {
          jwt.verify(token, jwtSecret, {}, (err, decoded) => {
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
app.get("/bookings", calculateTotalSalesForBooking);
app.get("/orders", calculateTotalSalesForOrder);
app.get("/geography", getGeography);
app.get("/user/:id", getUser);
app.post("/token", verifyToken);
app.get("/admins", getAdmins);
app.get("/customers", getCustomers);
app.get("/blist",getAllBookings);
app.get("/olist",getAllOrders);
const PORT = 9000;
const MONGO_URL = "mongodb://localhost:27017/mongo-golang";
mongoose.connect(MONGO_URL).then(async () => {
    await Booking.deleteMany(); // Clear existing data
    await Order.deleteMany(); // Clear existing data
    await User.deleteMany();
    await Booking.insertMany(bookings);
    await Order.insertMany(orders);
    await User.insertMany(users);
    app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
  }).catch((error) => console.log(`${error} did not connect`));