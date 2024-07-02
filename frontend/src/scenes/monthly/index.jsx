import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSumContext } from "UpdateSumContext";

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function sumOfSales(startDate, endDate, cumSum) {
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 1);
  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);
  return cumSum[endDateString] - cumSum[startDateString];
}

const Monthly = () => {
  const [startDate, setStartDate] = useState(new Date("2023-01-02"));
  const [endDate, setEndDate] = useState(new Date("2023-09-02"));
  const theme = useTheme();
  const { sumForBooking, sumForOrder, sumForDelivery } = useSumContext();
  console.log(sumForBooking);
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sumForBooking || !sumForOrder || !sumForDelivery) return;

      const totalSalesLineForBookings = {
        id: "Booking",
        color: theme.palette.secondary.main,
        data: [],
      };
      const totalSalesLineForOrders = {
        id: "Order",
        color: 'green',
        data: [],
      };
      const totalSalesLineForDeliveries = {
        id: "Delivery",
        color: 'red',
        data: [],
      };

      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      while (currentDate <= end) {
        try {
          const bookingResult = sumOfSales(startDate,currentDate,sumForBooking);
          const orderResult = sumOfSales(startDate,currentDate,sumForOrder);
          const deliveryResult = sumOfSales(startDate,currentDate, sumForDelivery);
          totalSalesLineForBookings.data.push({
            x: currentDate.getMonth(),
            y: bookingResult,
          });
          totalSalesLineForOrders.data.push({
            x: currentDate.getMonth(),
            y: orderResult, // Assuming orderResult contains the data you need
          });
          totalSalesLineForDeliveries.data.push({
            x: currentDate.getMonth(),
            y: deliveryResult, // Assuming orderResult contains the data you need
          });

        } catch (error) {
          console.error("Error fetching data:", error);
        }
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      setFormattedData([totalSalesLineForBookings, totalSalesLineForOrders, totalSalesLineForDeliveries]);
    };

    fetchData();
  }, [startDate, endDate, sumForBooking, sumForOrder, sumForDelivery, theme.palette.secondary.main, theme.palette.primary.main]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Monthly SALES" subtitle="Chart of monthly sales" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>

        {formattedData ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Month",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Monthly;
