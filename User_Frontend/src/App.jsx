import './App.css'
import { BrowserRouter, RouterProvider, Routes, Route } from 'react-router-dom'
// import router from './Router'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import { Provider } from 'react-redux'
import store from './store/store'
import Cart from './pages/cart/Cart'
import Home from './pages/Home/Home'
import About from './pages/about/About'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProductDetails from './pages/productDetails/productDetails'
import CheckOut from './pages/checkout/CheckOut'
import PaymentSuccess from './pages/khalti/Paymentsuccess'
import UserProfile from './pages/profile/UserProfile'
import MyOrders from './pages/myOrders/MyOrders'
import OrderDetails from './pages/orderDetails/OrderDetails'
import Dashboard from './pages/admin/dashboard/Dashboard'
import { ProtectedRouteForAdmin, ProtectedRouteForCustomer } from './pages/ProtectedRoute'
import MyOrdersQr from './pages/myOrdersQr/MyOrdersQr'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOTP from './pages/auth/VerifyOTP'
import ChangePassword from './pages/auth/ChangePassword'

function App() {

  return (
    <>
    <Provider store={store}>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<ProtectedRouteForCustomer><UserProfile /></ProtectedRouteForCustomer>} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/verifyotp" element={<VerifyOTP />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/myorderqr" element={<MyOrdersQr />} />
          <Route path="/admin" element={<ProtectedRouteForAdmin><Dashboard /></ProtectedRouteForAdmin>} />
        </Routes>
      <Footer />
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
