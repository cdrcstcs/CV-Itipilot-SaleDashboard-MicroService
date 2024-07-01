import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Customers from "scenes/customers";
import Geography from "scenes/geography";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Bookings from "scenes/bookings";
import Orders from "scenes/orders";
import Yearly from "scenes/yearly";
import { useGetUserQuery } from "state/api";
import axios from "axios";
import { useState, useEffect } from "react";
function getCookie(name) {
  const cookieRegex = new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  const cookieMatch = document.cookie.match(cookieRegex);
  return cookieMatch ? decodeURIComponent(cookieMatch[2]) : null;
}
function App() {
  const mode = 'dark';
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getCookie('usertoken');
        if (!token) {
          throw new Error('User token not found');
        }

        const res = await axios.post('http://localhost:9000/token', {token});
        setUserData(res.data.userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);
  const {data} = useGetUserQuery(userData);
  // if(!data){
  //   return null;
  // }
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/bookings" replace />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/yearly" element={<Yearly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
