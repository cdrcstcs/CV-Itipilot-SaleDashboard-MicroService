import React, { useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useGetBookingsQuery } from "state/api";
import { useGetOrdersQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Monthly = () => {
  const [startDate, setStartDate] = useState(new Date("2021-01-01"));
  const [endDate, setEndDate] = useState(new Date("2021-12-31"));
  const { data: bookings } = useGetBookingsQuery();
  const { data: orders } = useGetOrdersQuery();
  const theme = useTheme();

  const [formattedData] = useMemo(() => {
    if (!bookings || !orders) return [];

    const { monthlyData: monthlyBookings } = bookings;
    const { monthlyData: monthlyOrders } = orders;

    const totalSalesLineForBookings = {
      id: "totalBookingSales",
      color: theme.palette.secondary.main,
      data: [],
    };

    const totalSalesLineForOrders = {
      id: "totalOrderSales",
      color: theme.palette.primary.main,
      data: [],
    };

    Object.values(monthlyBookings).forEach(({ month, totalSales }) => {
      const dateFormatted = new Date(month);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = month.substring(month.indexOf("-") + 1);
        totalSalesLineForBookings.data = [
          ...totalSalesLineForBookings.data,
          { x: splitDate, y: totalSales },
        ];
      }
    });

    Object.values(monthlyOrders).forEach(({ month, totalSales }) => {
      const dateFormatted = new Date(month);
      if (dateFormatted >= startDate && dateFormatted <= endDate) {
        const splitDate = month.substring(month.indexOf("-") + 1);
        totalSalesLineForOrders.data = [
          ...totalSalesLineForOrders.data,
          { x: splitDate, y: totalSales },
        ];
      }
    });

    const formattedData = [totalSalesLineForBookings, totalSalesLineForOrders];
    return [formattedData];
  }, [bookings, orders, startDate, endDate, theme.palette.secondary.main, theme.palette.primary.main]);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="MONTHLY SALES" subtitle="Chart of monthly sales" />
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
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
              dateFormat="MM/yyyy"
              showMonthYearPicker
            />
          </Box>
        </Box>

        {(bookings && orders) ? (
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
              tickRotation: 0,
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
