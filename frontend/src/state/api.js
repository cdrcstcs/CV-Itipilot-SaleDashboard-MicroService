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
    "Rlist",
    "Hlist",
    "Geography",
    "Admins",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    getBookingList: build.query({
      query: () => "/blist",
      providesTags: ["Blist"],
    }),
    getOrderList: build.query({
      query: () => "/olist",
      providesTags: ["Olist"],
    }),
    getRestaurantList: build.query({
      query: () => "/rlist",
      providesTags: ["Rlist"],
    }),
    getHotelList: build.query({
      query: () => "/hlist",
      providesTags: ["Hlist"],
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
  useGetBookingListQuery,
  useGetOrderListQuery,
  useGetRestaurantListQuery,
  useGetHotelListQuery,
  useGetCustomersQuery,
  useGetGeographyQuery,
  useGetAdminsQuery,
} = api;
