import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useGetHotelListQuery } from "state/api"; // Adjust path as needed
const Hotel = ({
  _id,
  price,
  address,
  city,
  bedroom,
  bathroom,
  country,
  latitude,
  longitude,
  userId,
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
          {_id}
        </Typography>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {city}, {country}
        </Typography>
        <Typography variant="h5" component="div">
          {address}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Typography variant="body2">{userId ? `User ID: ${userId}` : "No user specified"}</Typography>
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
          <Typography>Latitude: {latitude}</Typography>
          <Typography>Longitude: {longitude}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Hotels = () => {
  const { data, isLoading } = useGetHotelListQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Hotels" subtitle="List of Hotels." />
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
              country,
              latitude,
              longitude,
              userId,
            }) => (
              <Hotel
                key={_id}
                _id={_id}
                price={price}
                address={address}
                city={city}
                bedroom={bedroom}
                bathroom={bathroom}
                country={country}
                latitude={latitude}
                longitude={longitude}
                userId={userId}
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

export default Hotels;
