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
import SingleProduct from "./pages/admin/products/SingleProduct";
import Navbar from "./components/navbar";
import Footer from "./components/footer/Footer";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
            <Route path="/admin/orders/:id" element={<SingleOrder />} />
            <Route path="/admin/products/:id" element={<SingleProduct />} />
            <Route path="/admin/products/addproduct" element={<AddProduct />} />
            <Route path="/admin/products/editproduct/:id" element={<EditProduct />} />
            {/* <Route path="rtl/*" element={<RtlLayout />} /> */}
            {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
