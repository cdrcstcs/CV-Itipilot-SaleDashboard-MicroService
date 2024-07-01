import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetBookingListQuery } from "state/api";
const Booking = ({
  _id,
  price,
  address,
  city,
  bedroom,
  bathroom,
  userId,
  createdAt
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {city}
        </Typography>
        <Typography variant="h5" component="div">
          {address}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Typography variant="body2">
          {userId ? `User ID: ${userId}` : 'No user specified'}
        </Typography>
        <Typography>{bedroom} beds</Typography>
        <Typography>{bathroom} bathrooms</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>Id: {_id}</Typography>
          <Typography>Created At: {new Date(createdAt).toLocaleString()}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Bookings = () => {
  const { data, isLoading } = useGetBookingListQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="BOOKINGS" subtitle="List of bookings." />
      {data || !isLoading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              price,
              address,
              city,
              bedroom,
              bathroom,
              userId, 
              createdAt,
            }) => (
              <Booking
                key={_id} 
                _id={_id} 
                price={price}
                address={address}
                city={city}
                bedroom={bedroom}
                bathroom={bathroom}
                userId={userId}
                createdAt={createdAt}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Bookings;
