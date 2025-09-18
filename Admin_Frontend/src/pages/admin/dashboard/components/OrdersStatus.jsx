import { useEffect, useState } from "react";
import Card from "../../../../components/card";
import BarChart from "../../../../components/charts/BarChart";
import {
  barChartOptions,
} from "../../../../variables/charts";
import { MdBarChart } from "react-icons/md";
import api from "../../../../http/ApiService";

const OrdersStatus = () => {
  const [datas, setDatas] = useState({ allOrders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await api.getDatas("admin/misc/datas");
        console.log("result", result);
        setDatas(result || { allOrders: [] });
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load order data. Please try again later.");
        setDatas({ allOrders: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch order status counts
  const allPendingOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "pending"
  );
  const totalPendingOrders = allPendingOrders?.length || 0;

  const allDeliveredOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "delivered"
  );
  const totalDeliveredOrders = allDeliveredOrders?.length || 0;

  const allCancelledOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "cancelled"
  );
  const totalCancelledOrders = allCancelledOrders?.length || 0;

  const allInTransitOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "in transit"
  );
  const totalInTransitOrders = allInTransitOrders?.length || 0;

    const allInPreparingOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "preparing"
  );
  const totalInPreparingOrders = allInPreparingOrders?.length || 0;

  // Dynamic bar chart data
  const barChartData = [
    {
      name: "Orders Status",
      data: [
        totalPendingOrders,
        totalInTransitOrders,
        totalDeliveredOrders,
        totalCancelledOrders,
        totalInPreparingOrders,
      ],
      color: "#5E37FF", // Purple
    },
  ];

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-black">
          Orders Status
        </h2>
        <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6 dark:text-blue-500" />
        </button>
      </div>

      <div className="mt-6 md:mt-16 lg:mt-0">
        <div className="h-[300px] w-full xl:h-[400px]">
          <BarChart
            chartData={barChartData}
            chartOptions={barChartOptions}
          />
        </div>
      </div>
    </Card>
  );
};

export default OrdersStatus;

