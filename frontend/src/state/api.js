import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000'}),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Bookings",
    "Orders",
    "Customers",
    "Blist",
    "Olist",
    "Geography",
    "Admins",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    getBookings: build.query({
      query: (startDate, endDate) => `/bookings/${startDate}/${endDate}`,
      providesTags: ["Bookings"],
    }),
    getOrders: build.query({
      query: (startDate, endDate) => `/orders/${startDate}/${endDate}`,
      providesTags: ["Orders"],
    }),
    getBookingList: build.query({
      query: () => "/blist",
      providesTags: ["Blist"],
    }),
    getOrderList: build.query({
      query: () => "/olist",
      providesTags: ["Olist"],
    }),
    getCustomers: build.query({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
    getGeography: build.query({
      query: () => "/geography",
      providesTags: ["Geography"],
    }),
    getAdmins: build.query({
      query: () => "/admins",
      providesTags: ["Admins"],
    }),
  }),
});
export const {
  useGetUserQuery,
  useGetBookingsQuery,
  useGetOrdersQuery,
  useGetBookingListQuery,
  useGetOrderListQuery,
  useGetCustomersQuery,
  useGetGeographyQuery,
  useGetAdminsQuery,
} = api;