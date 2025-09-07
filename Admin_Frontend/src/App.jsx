import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import RtlLayout from "./layouts/rtl";
import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import { Provider } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import store from './store/store'
import Login from "./pages/auth/Login";
import SingleOrder from "./pages/admin/orders/singleOrder";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
            <Route path="/orderdetails/:id" element={<SingleOrder />} />
            {/* <Route path="rtl/*" element={<RtlLayout />} /> */}
            {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
