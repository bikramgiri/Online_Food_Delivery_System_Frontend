import MiniCalendar from "../../../components/calendar/MiniCalendar";
import WeeklyRevenue from "../../../pages/admin/dashboard/components/WeeklyRevenue";
import TotalSpent from "../../../pages/admin/dashboard/components/TotalSpent";
import PieChartCard from "../../../pages/admin/dashboard/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdPerson, MdOutlineShoppingCart, MdDashboard } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "../../../components/widget/Widget";
import CheckTable from "../../../pages/admin/dashboard/components/CheckTable";
import ComplexTable from "../../../pages/admin/dashboard/components/ComplexTable";
import DailyTraffic from "../../../pages/admin/dashboard/components/DailyTraffic";
import TaskCard from "../../../pages/admin/dashboard/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { useEffect, useState } from "react";
import api from "../../../http/ApiService";

const Dashboard = () => {
  const [datas, setDatas] = useState({})

  useEffect(() => {
    (
    async () => {
      const result = await api.getDatas("admin/misc/datas")
      console.log("result", result);
      setDatas(result);
  } 
  )()
  }, [])

 // fetch all stock quantity from datas.allOrders
 const allStockQuantities = datas && datas.allOrders?.map((order) => {
    return order.items.map(item => item.quantity);
  });

  // sum all stock quantities
  const totalStock = allStockQuantities && allStockQuantities.flat().reduce((a, b) => a + b, 0);
  console.log("totalStock", totalStock);

  const totalUserOrders = datas && datas.allOrders?.map((order)=>{
    return {
      userId : order.user._id,
    }
  })
  console.log("totalUserOrders", totalUserOrders);

  const uniqueTotalUserOrders = [...new Set(totalUserOrders?.map(user => user.userId))];
  console.log("uniqueTotalUserOrders", uniqueTotalUserOrders);

  return (
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
        <WeeklyRevenue />
        {/* <TotalSpent /> */}
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
