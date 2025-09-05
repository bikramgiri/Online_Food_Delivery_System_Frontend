import React from "react";

// Auth Imports
// import SignIn from "./pages/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

// Admin Imports
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Products from "./pages/admin/product/Product";
// import RTLDefault from "./pages/rtl/default";
import Orders from "./pages/admin/order/Order";
import Users from "./pages/admin/user/User";
import Reviews from "./pages/admin/review/Review";


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
    icon: <MdBarChart className="h-6 w-6" />,
    path: "products",
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
    icon: <MdLock className="h-6 w-6" />,
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