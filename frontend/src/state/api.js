import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000'}),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Bookings",
    "Orders",
    "Bsum",
    "Osum",
    "Customers",
    "Blist",
    "Olist",
    "Geography",
    "Admins",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/user/${id}`, // Ensure template string is properly quoted
      providesTags: ["User"],
    }),
    getBookingSum: build.query({
      query: () => "/bsum",
      providesTags: ["Bsum"],
    }),
    getOrderSum: build.query({
      query: () => "/osum",
      providesTags: ["Osum"],
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
  useGetBookingSumQuery,
  useGetOrderSumQuery,
  useGetBookingListQuery,
  useGetOrderListQuery,
  useGetCustomersQuery,
  useGetGeographyQuery,
  useGetAdminsQuery,
} = api;
