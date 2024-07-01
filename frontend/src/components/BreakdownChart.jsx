import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";
import { useGetBookingsQuery, useGetOrdersQuery } from "state/api";
import { useState, useEffect } from "react";

function sumOfSales(startDate, endDate, totals) {
  const { cumSumB } = totals;
  const startYear = startDate.getFullYear();
  const startMonth = String(startDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month and padding with zero if necessary
  const startDay = String(startDate.getDate()).padStart(2, '0'); 
  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month and padding with zero if necessary
  const endDay = String(endDate.getDate()).padStart(2, '0'); 
  let sum = 0;

  if (cumSumB && cumSumB[endYear] && cumSumB[endYear][endMonth] && cumSumB[endYear][endMonth][endDay]) {
    sum = cumSumB[endYear][endMonth][endDay];
  }

  if (startDay > 0 && cumSumB && cumSumB[startYear] && cumSumB[startYear][startMonth] && cumSumB[startYear][startMonth][startDay - 1]) {
    sum -= cumSumB[startYear][startMonth][startDay - 1];
  }

  if (startMonth > 0 && cumSumB && cumSumB[startYear] && cumSumB[startYear][startMonth - 1] && cumSumB[startYear][startMonth - 1][cumSumB[startYear][startMonth - 1].length - 1]) {
    sum -= cumSumB[startYear][startMonth - 1][cumSumB[startYear][startMonth - 1].length - 1];
  }

  if (startYear > 0 && cumSumB && cumSumB[startYear - 1] && cumSumB[startYear - 1][cumSumB[startYear - 1].length - 1] && cumSumB[startYear - 1][cumSumB[startYear - 1].length - 1][cumSumB[startYear - 1][cumSumB[startYear - 1].length - 1].length - 1]) {
    sum -= cumSumB[startYear - 1][cumSumB[startYear - 1].length - 1][cumSumB[startYear - 1][cumSumB[startYear - 1].length - 1].length - 1];
  }

  return sum;
}

const BreakdownChart = () => {
  const theme = useTheme();
  const startDate = new Date("2021-02-01");
  const endDate = new Date();
  const { data: cumSumB } = useGetBookingsQuery();
  const { data: cumSumO } = useGetOrdersQuery();
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    if (cumSumB && cumSumO) {
      setFormattedData([{
          id: 'Bookings',
          label: "Bookings",
          value: sumOfSales(startDate, endDate, { cumSumB }),
          color: 'green',
        },
        {
          id: 'Orders',
          label: "Orders",
          value: sumOfSales(startDate, endDate, { cumSumO }),
          color: 'yellow',
        }]);
    }
  }, [cumSumB, cumSumO, theme.palette.secondary.main, theme.palette.primary.main]);

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
        colors={(datum) => datum.data.color}
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
