import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const SumContext = createContext();
export const useSumContext = () => {
  return useContext(SumContext);
};
export const SumContextProvider = ({ children }) => {
  const [sumForBooking, setSumForBooking] = useState(null);
  const [sumForOrder, setSumForOrder] = useState(null);
  const [sumForDelivery, setSumForDelivery] = useState(null);
  useEffect(() => {
    const fetchDeliverySum = async () => {
      try {
        const response = await axios.get("http://localhost:9000/rsum");
        setSumForDelivery(response.data); 
      } catch (error) {
        console.error("Error fetching Delivery sum:", error);
      }
    };
    const fetchBookingSum = async () => {
      try {
        const response = await axios.get("http://localhost:9000/bsum");
        setSumForBooking(response.data); 
      } catch (error) {
        console.error("Error fetching booking sum:", error);
      }
    };
    const fetchOrderSum = async () => {
      try {
        const response = await axios.get("http://localhost:9000/osum");
        setSumForOrder(response.data);
      } catch (error) {
        console.error("Error fetching order sum:", error);
      }
    };
    fetchDeliverySum();
    fetchBookingSum();
    fetchOrderSum();
    const interval = setInterval(() => {
      fetchDeliverySum();
      fetchBookingSum();
      fetchOrderSum();
    }, 86400000);
    return () => clearInterval(interval);
  }, []);
  return (
    <SumContext.Provider value={{ sumForBooking, sumForOrder, sumForDelivery }}>
      {children}
    </SumContext.Provider>
  );
};
