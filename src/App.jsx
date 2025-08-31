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

function App() {

  return (
    <>
    <Provider store={store}>
    {/* <Navbar />
    <RouterProvider router = {router} />
    <Footer /> */}
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      <Footer />
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
