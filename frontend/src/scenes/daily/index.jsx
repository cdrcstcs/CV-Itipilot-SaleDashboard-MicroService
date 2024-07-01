import React, { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSumContext } from "UpdateSumContext";
import { usePostBookingsMutation, usePostOrdersMutation } from "state/api";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const theme = useTheme();
  const { sumForBooking, sumForOrder } = useSumContext();
  const [postBookings] = usePostBookingsMutation();
  const [postOrders] = usePostOrdersMutation();
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!sumForBooking || !sumForOrder) return;

      const totalSalesLineForBookings = {
        id: "Booking",
        color: theme.palette.secondary.main,
        data: [],
      };
      const totalSalesLineForOrders = {
        id: "Order",
        color: theme.palette.primary.main,
        data: [],
      };

      let currentDate = new Date(startDate);
      const end = new Date(endDate);
      while (currentDate <= end) {
        try {
          const bookingResult = await postBookings({
            startDate: startDate,
            endDate: currentDate,
            cumSum: sumForBooking,
          });
          const orderResult = await postOrders({
            startDate: startDate,
            endDate: currentDate,
            cumSum: sumForOrder,
          });

          totalSalesLineForBookings.data.push({
            x: currentDate.getDate(),
            y: bookingResult.data, // Assuming bookingResult contains the data you need
          });
          totalSalesLineForOrders.data.push({
            x: currentDate.getDate(),
            y: orderResult.data, // Assuming orderResult contains the data you need
          });

        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error as needed
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setFormattedData([totalSalesLineForBookings, totalSalesLineForOrders]);
    };

    fetchData();
  }, [startDate, endDate, sumForBooking, sumForOrder, theme.palette.secondary.main, theme.palette.primary.main, postBookings, postOrders]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />
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

export default Daily;
