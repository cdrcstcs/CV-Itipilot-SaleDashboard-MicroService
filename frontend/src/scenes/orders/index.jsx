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
import { useGetOrderListQuery } from "state/api";
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
} from "@mui/material";

const Order = ({
  _id,
  restaurant,
  user,
  deliveryDetails,
  cartItems,
  totalAmount,
  status,
  createdAt,
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
          {status}
        </Typography>
        <Typography variant="h5" component="div">
          {restaurant.name} Order
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          Total Amount: ${Number(totalAmount).toFixed(2)}
        </Typography>
        <Typography variant="body2">
          User: {deliveryDetails.name} ({deliveryDetails.email})
          {user ? `User ID: ${user}` : 'No user specified'}
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
          <Typography>Id: {_id}</Typography>
          <Typography>Created At: {new Date(createdAt).toLocaleString()}</Typography>
          <Typography>Items:</Typography>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Collapse>
    </Card>
  );
};
const Orders = () => {
  const { data, isLoading } = useGetOrderListQuery();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
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
              restaurant,
              user,
              deliveryDetails,
              cartItems,
              totalAmount,
              status,
              createdAt,
            }) => (
              <Order
                _id={_id}
                restaurant={restaurant}
                user={user}
                deliveryDetails={deliveryDetails}
                cartItems={cartItems}
                totalAmount={totalAmount}
                status={status}
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
export default Orders;
