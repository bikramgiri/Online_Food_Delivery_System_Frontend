import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/about/About";
import AddProduct from "./pages/product/AddProduct";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

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
    path: "/addProduct",
    element: <AddProduct />,
  },
    {
    path: "/register",
    element: <Register />,
  },
    {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
