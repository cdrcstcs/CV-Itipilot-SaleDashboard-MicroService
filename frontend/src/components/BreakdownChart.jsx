import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useSumContext } from "UpdateSumContext";
import DatePicker from "react-datepicker";
import Header from "./Header";


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

const BreakdownChart = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date("2023-01-02"));
  const [endDate, setEndDate] = useState(new Date("2023-09-02"));
  const { sumForBooking, sumForOrder } = useSumContext();
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResult = sumOfSales(startDate,endDate,sumForBooking);
        const orderResult = sumOfSales(startDate,endDate,sumForOrder);
        setFormattedData([
          {
            id: 'Bookings',
            label: "Bookings",
            value: bookingResult,
            color: 'green',
          },
          {
            id: 'Orders',
            label: "Orders",
            value: orderResult,
            color: 'yellow',
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, sumForBooking, sumForOrder]);
  return (
    <Box m="1.5rem 2.5rem">
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
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
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
      ) : (
        <div>Loading</div>
      )}
      </Box>
    </Box>
  );
  
};

export default BreakdownChart;