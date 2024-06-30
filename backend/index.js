import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { calculateTotalSalesForBooking, getAllBookings } from "./controllers/booking";
import { calculateTotalSalesForOrder, getAllOrders } from "./controllers/order";
import { getGeography } from "./controllers/geography";
import { getUser, getCustomers, getAdmins } from "./controllers/user";
import jwt from "jsonwebtoken";
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
async function verifyToken(req, res, next) {
  try {

    console.log(req.cookies.usertoken);
      const token = req.cookies.usertoken;
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
      req.user = userData;
      console.log(req.user);
      next(); 
  } catch (err) {
      res.status(401).send(err.message || 'Unauthorized');
  }
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/bookings", calculateTotalSalesForBooking);
app.get("/orders", calculateTotalSalesForOrder);
app.get("/geography", getGeography);
app.get("/user", verifyToken, getUser);
app.get("/admins", getAdmins);
app.get("/customers", getCustomers);
app.get("/blist",getAllBookings);
app.get("/olist",getAllOrders);
const PORT = 9000;
const MONGO_URL = "mongodb://localhost:27017/mongo-golang";
mongoose.connect(MONGO_URL).then(() => { app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); }).catch((error) => console.log(`${error} did not connect`));