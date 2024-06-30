import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";
import { useGetBookingsQuery, useGetOrdersQuery } from "state/api";

const BreakdownChart = () => {
  const theme = useTheme();
  const { bookings } = useGetBookingsQuery();
  const { orders } = useGetOrdersQuery();

  if (!bookings || !orders) return "Loading...";

  let totalSalesForBookings = Object.values(bookings).reduce((acc, timeType) => {
    return acc + Object.values(timeType).reduce((acc1, { time, totalSales }) => {
      return acc1 + totalSales;
    }, 0);
  }, 0);

  let totalSalesForOrders = Object.values(orders).reduce((acc, timeType) => {
    return acc + Object.values(timeType).reduce((acc1, { time, totalSales }) => {
      return acc1 + totalSales;
    }, 0);
  }, 0);

  const formattedData = [
    {
      id: 'Bookings',
      label: "Bookings",
      value: totalSalesForBookings,
      color: theme.palette.secondary[500],
    },
    {
      id: 'Orders',
      label: "Orders",
      value: totalSalesForOrders,
      color: theme.palette.secondary[300],
    }
  ];

  return (
    <Box
      height="100%"
      width={undefined}
      minHeight={undefined}
      minWidth={undefined}
      position="relative"
    >
      <ResponsivePie
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
        colors={(datum) => datum.color}
        margin={
          { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue={true}
        innerRadius={0.45}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.primary[500],
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default BreakdownChart;
