import mongoose from "mongoose";

const GeneralStatSchema = new mongoose.Schema(
  {
    yearlyData: [
      {
        year: String,
        totalSales: Number,
      },
    ],
    monthlyData: [
      {
        month: String,
        totalSales: Number,
      },
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
      },
    ],
  },
  { timestamps: true }
);

const GeneralStat = mongoose.model("ProductStat", GeneralStatSchema);
export default GeneralStat;
