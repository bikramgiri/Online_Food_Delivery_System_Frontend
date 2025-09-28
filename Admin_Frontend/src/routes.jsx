import React from "react";

// Auth Imports
// import SignIn from "./pages/auth/SignIn";
import ReviewIcon from './components/icons/ReviewsIcon'

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdReviews
} from "react-icons/md";

// Admin Imports
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Products from "./pages/admin/products/Product";
// import RTLDefault from "./pages/rtl/default";
import Orders from "./pages/admin/orders/Order";
import Users from "./pages/admin/users/User";
import Reviews from "./pages/admin/reviews/Reviews";
import SingleOrder from "./pages/admin/orders/singleOrder";
import SingleProduct from "./pages/admin/products/SingleProduct";


// Pre-rendered icon components
// const HomeIcon = () => <MdHome className="h-6 w-6" />;
// const CartIcon = () => <MdOutlineShoppingCart className="h-6 w-6" />;
// const ChartIcon = () => <MdBarChart className="h-6 w-6" />;
// const PersonIcon = () => <MdPerson className="h-6 w-6" />;
// const LockIcon = () => <MdLock className="h-6 w-6" />;

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: Dashboard,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "products",
    icon: <MdBarChart className="h-6 w-6" />,
    component: Products,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "orders",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: Orders,
    secondary: true,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPerson className="h-6 w-6" />,
    component: Users,
  },
  {
    name: "Reviews",
    layout: "/admin",
    path: "reviews",
    icon: <MdReviews className="h-6 w-5" />,
    component: Reviews,
  },
  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "sign-in",
  //   icon: HomeIcon,
  //   component: SignIn,
  // },
];

export default routes;