import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { calculateTotalSalesForBooking } from "./controllers/booking";
import { calculateTotalSalesForOrder } from "./controllers/order";
import { getGeography } from "./controllers/geography";
import { getUser, getCustomers, getAdmins } from "./controllers/user";
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/booking", calculateTotalSalesForBooking);
app.get("/order", calculateTotalSalesForOrder);
app.get("/geography", getGeography);
app.get("/user", getUser);
app.get("/admins", getAdmins);
app.get("/customer", getCustomers);
const PORT = 9000;
const MONGO_URL = "mongodb://localhost:27017/mongo-golang";
mongoose.connect(MONGO_URL).then(() => { app.listen(PORT, () => console.log(`Server Port: ${PORT}`)); }).catch((error) => console.log(`${error} did not connect`));