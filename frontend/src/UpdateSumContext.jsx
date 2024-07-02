import { createContext, useContext, useState, useEffect } from "react";
import { useGetBookingSumQuery, useGetOrderSumQuery } from "state/api";

export const SumContext = createContext();

export const useSumContext = () => {
  return useContext(SumContext);
};

export const SumContextProvider = ({ children }) => {
  const [sumForBooking, setSumForBooking] = useState(null);
  const [sumForOrder, setSumForOrder] = useState(null);

  const { data: bookingData } = useGetBookingSumQuery();
  const { data: orderData } = useGetOrderSumQuery();
  console.log(sumForOrder);

  useEffect(() => {
    if (bookingData) {
      setSumForBooking(bookingData);
    }
    if (orderData) {
      setSumForOrder(orderData);
    }
  }, [bookingData, orderData]);
  console.log(sumForBooking);

  return (
    <SumContext.Provider value={{ sumForBooking, sumForOrder }}>
      {children}
    </SumContext.Provider>
  );
};