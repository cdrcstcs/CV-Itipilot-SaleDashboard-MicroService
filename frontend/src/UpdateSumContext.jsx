import { createContext, useContext, useState, useEffect } from "react";
import { useGetBookingSumQuery, useGetOrderSumQuery } from "state/api";
export const SumContext = createContext();
export const useSumContext = () => {
    return useContext(SumContext);
};
export const SumContextProvider = ({ children }) => {
    const [sumForBooking, setSumForBooking] = useState(null);
    const [sumForOrder, setSumForOrder] = useState(null);
    const fetchSumData = async () => {
        try {
            const { data: booking } = await useGetBookingSumQuery();
            const { data: order } = await useGetOrderSumQuery();
            setSumForBooking(booking);
            setSumForOrder(order);
        } catch (error) {
            console.error("Error fetching sum data:", error);
            setSumForBooking(null);
            setSumForOrder(null);
        }
    };
    useEffect(() => {
        fetchSumData();
        const intervalId = setInterval(fetchSumData, 24 * 60 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []); 
    return (
        <SumContext.Provider value={{ sumForBooking, sumForOrder }}>
            {children}
        </SumContext.Provider>
    );
};
