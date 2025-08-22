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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
        </Routes>
      <Footer />
    </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
