import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
function getCookie(name) {
  const cookieRegex = new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  const cookieMatch = document.cookie.match(cookieRegex);
  return cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;
}
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000', prepareHeaders: (headers) => {
    const token = getCookie('usertoken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }}),
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
      query: () => `/user`,
      providesTags: ["User"],
    }),
    getBookings: build.query({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),
    getOrders: build.query({
      query: () => "/orders",
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