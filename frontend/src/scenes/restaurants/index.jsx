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
import Header from "components/Header"; // Adjust path as needed
import { useGetRestaurantListQuery } from "state/api";

const Restaurant = ({
  _id,
  restaurantName,
  city,
  country,
  deliveryPrice,
  estimatedDeliveryTime,
  cuisines,
  menuItems,
  lastUpdated,
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
          {restaurantName}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          Delivery Price: ${deliveryPrice.toFixed(2)} | Estimated Delivery Time: {estimatedDeliveryTime} mins
        </Typography>
        <Typography variant="body2">
          Cuisines: {cuisines.join(", ")}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Last Updated: {new Date(lastUpdated).toLocaleDateString()}
        </Typography>
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
          <Typography gutterBottom variant="h6">
            Menu Items:
          </Typography>
          {menuItems.map((item, index) => (
            <Typography key={index} variant="body2">
              {item.name} - ${item.price.toFixed(2)}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Restaurants = () => {
    const { data, isLoading } = useGetRestaurantListQuery();
    const isNonMobile = useMediaQuery("(min-width: 1000px)");
  
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="Restaurants" subtitle="List of Restaurants." />
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
                restaurantName,
                city,
                country,
                deliveryPrice,
                estimatedDeliveryTime,
                cuisines,
                menuItems,
                lastUpdated,
              }) => (
                <Restaurant
                  _id={_id}
                  restaurantName={restaurantName}
                  city={city}
                  country={country}
                  deliveryPrice={deliveryPrice}
                  estimatedDeliveryTime={estimatedDeliveryTime}
                  cuisines={cuisines}
                  menuItems={menuItems}
                  lastUpdated={lastUpdated}
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
export default Restaurants;