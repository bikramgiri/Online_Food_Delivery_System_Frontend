import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import store from './store/store'

import RtlLayout from "./layouts/rtl";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import AdminLogin from "./pages/auth/Login";
import { Provider } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="admin/*" element={<AdminLayout />} />
            {/* <Route path="rtl/*" element={<RtlLayout />} /> */}
            {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
