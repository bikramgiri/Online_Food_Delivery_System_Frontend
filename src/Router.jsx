import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/about/About";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Cart from "./pages/cart/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
    {
    path: "/register",
    element: <Register />,
  },
    {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cart",
    element: <Cart />,
  }
]);

export default router;
