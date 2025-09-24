import MiniCalendar from "../../../components/calendar/MiniCalendar";
import OrdersStatus from "./components/OrdersStatus";
import TotalSpent from "../../../pages/admin/dashboard/components/TotalSpent";
import ProductsStatus from "./components/ProductsStatus";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdPerson, MdOutlineShoppingCart, MdDashboard } from "react-icons/md";

// import { columnsDataComplex } from "./variables/columnsData";

import Widget from "../../../components/widget/Widget";
import UsersData from "./components/UsersData";
import ComplexTable from "../../../pages/admin/dashboard/components/ComplexTable";
import DailyTraffic from "../../../pages/admin/dashboard/components/DailyTraffic";
import TaskCard from "../../../pages/admin/dashboard/components/TaskCard";
// import tableDataCheck from "./variables/tableDataCheck.json";
// import tableDataComplex from "./variables/tableDataComplex.json";
import React, { useEffect, useState } from "react";
import api from "../../../http/ApiService";
// import { all } from "axios";


// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error("ErrorBoundary caught an error:", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-center py-4 text-red-500">Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}
const Dashboard = () => {
  const [datas, setDatas] = useState({ allOrders: [], allUsers: [], allProducts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
      const result = await api.getDatas("admin/misc/datas")
      setDatas(result || { allOrders: [], allUsers: [], allProducts: [] });
      setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
  } 
  )()
  }, [])

 // fetch all stock quantity from datas.allProducts
  const allStockQuantities = datas && datas.allProducts?.map((product) => product.productStockQty || 0);

  // sum all stock quantities
  const totalStock = allStockQuantities && allStockQuantities.flat().reduce((a, b) => a + b, 0);

  // const totalUserOrders = datas && datas.allOrders?.map((order)=>{
  //   return {
  //     userId : order.user._id,
  //   }
  // })

  // const uniqueTotalUserOrders = [...new Set(totalUserOrders?.map(user => user.userId))];
  // console.log("uniqueTotalUserOrders", uniqueTotalUserOrders);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <ErrorBoundary>
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7 dark:text-blue-500" />}
          title={"Products"}
          subtitle={`${datas.products || 0}`}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6 dark:text-blue-500" />}
          title={"Total Stock"}
          subtitle={`${totalStock || 0}`}
        />
        <Widget
          icon={<MdOutlineShoppingCart className="h-6 w-6 dark:text-blue-500" />}
          title={"Orders"}
          subtitle={`${datas.orders || 0}`}
        />
        <Widget
          icon={<MdPerson className="h-7 w-7 dark:text-blue-500" />}
          title={"Users"}
          subtitle={`${datas.users || 0}`}
        />
        {/* <Widget
          icon={<MdBarChart className="h-7 w-7 dark:text-blue-500" />}
          title={"New Tasks"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6 dark:text-blue-500" />}
          title={"Total Projects"}
          subtitle={"$2433"}
        /> */}
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <OrdersStatus />
        <ProductsStatus />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <UsersData allOrders={datas.allOrders} allUsers={datas.allUsers} />
        <MiniCalendar />
      </div>

      {/* <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <DailyTraffic />
          <TotalSpent />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
          <TaskCard />
      </div> */}


      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Users Data */}
        {/* <div>
          <UsersData allOrders={datas.allOrders} allUsers={datas.allUsers} />
        </div> */}

        {/* Traffic chart & Pie Chart */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <TotalSpent />
        </div> */}

        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          {/* <TaskCard /> */}
          <div className="grid grid-cols-1 rounded-[20px]">
            {/* <MiniCalendar /> */}
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
