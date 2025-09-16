// import { useEffect, useState } from "react";
// import Card from "../../../../components/card";
// import BarChart from "../../../../components/charts/BarChart";
// import {
//   barChartDataWeeklyRevenue,
//   barChartOptionsWeeklyRevenue,
// } from "../../../../variables/charts";
// import { MdBarChart } from "react-icons/md";
// import api from "../../../../http/ApiService";

// const WeeklyRevenue = () => {
//     const [datas, setDatas] = useState({})
  
//     useEffect(() => {
//       (
//       async () => {
//         const result = await api.getDatas("admin/misc/datas")
//         console.log("result", result);
//         setDatas(result);
//     } 
//     )()
//     }, [])

//     // fetch all pending orders length from datas.allOrders
//     const allPendingOrders = datas && datas.allOrders?.filter(order => order.orderStatus === "pending");
//     // sum all pending orders length
//     const totalPendingOrders = allPendingOrders && allPendingOrders.length;
//     console.log("totalPendingOrders", totalPendingOrders);

//     // fetch all delivered orders length from datas.allOrders
//     const allDeliveredOrders = datas && datas.allOrders?.filter(order => order.orderStatus === "delivered");
//     // sum all delivered orders length
//     const totalDeliveredOrders = allDeliveredOrders && allDeliveredOrders.length;
//     console.log("totalDeliveredOrders", totalDeliveredOrders);

//     // fetch all cancelled orders length from datas.allOrders
//     const allCancelledOrders = datas && datas.allOrders?.filter(order => order.orderStatus === "cancelled");
//     // sum all cancelled orders length
//     const totalCancelledOrders = allCancelledOrders && allCancelledOrders.length;
//     console.log("totalCancelledOrders", totalCancelledOrders);

//     // fetch all In transit orders length from datas.allOrders
//     const allInTransitOrders = datas && datas.allOrders?.filter(order => order.orderStatus === "in transit");
//     // sum all In transit orders length
//     const totalInTransitOrders = allInTransitOrders && allInTransitOrders.length;
//     console.log("totalInTransitOrders", totalInTransitOrders);

//   return (
//     <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
//       <div className="mb-auto flex items-center justify-between px-6">
//         <h2 className="text-lg font-bold text-navy-700 dark:text-gray-600">
//           Orders Status
//         </h2>
//         <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
//           <MdBarChart className="h-8 w-8 dark:text-blue-500" />
//         </button>
//       </div>

//       <div className="md:mt-16 lg:mt-0">
//         <div className="h-[250px] w-full xl:h-[350px]">
//           <BarChart
//             chartData={barChartDataWeeklyRevenue}
//             chartOptions={barChartOptionsWeeklyRevenue}
//           />
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default WeeklyRevenue;





import { useEffect, useState } from "react";
import Card from "../../../../components/card";
import BarChart from "../../../../components/charts/BarChart";
import {
  // barChartDataWeeklyRevenue,
  barChartOptionsWeeklyRevenue,
} from "../../../../variables/charts";
import { MdBarChart } from "react-icons/md";
import api from "../../../../http/ApiService";

const WeeklyRevenue = () => {
  const [datas, setDatas] = useState({ allOrders: [] }); // Initialize with empty array to avoid undefined

  useEffect(() => {
    (async () => {
      try {
        const result = await api.getDatas("admin/misc/datas");
        console.log("result", result);
        setDatas(result || { allOrders: [] }); // Fallback to empty object with empty array
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDatas({ allOrders: [] }); // Set fallback on error
      }
    })();
  }, []);

  // Fetch all pending orders length from datas.allOrders
  const allPendingOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "pending"
  );
  const totalPendingOrders = allPendingOrders?.length || 0;

  // Fetch all delivered orders length from datas.allOrders
  const allDeliveredOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "delivered"
  );
  const totalDeliveredOrders = allDeliveredOrders?.length || 0;

  // Fetch all cancelled orders length from datas.allOrders
  const allCancelledOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "cancelled"
  );
  const totalCancelledOrders = allCancelledOrders?.length || 0;

  // Fetch all in-transit orders length from datas.allOrders
  const allInTransitOrders = datas.allOrders?.filter(
    (order) => order.orderStatus === "in transit"
  );
  const totalInTransitOrders = allInTransitOrders?.length || 0;

  console.log("totalPendingOrders", totalPendingOrders);
  console.log("totalDeliveredOrders", totalDeliveredOrders);
  console.log("totalCancelledOrders", totalCancelledOrders);
  console.log("totalInTransitOrders", totalInTransitOrders);

  // Update bar chart data with dynamic values
  const updatedBarChartData = [
    {
      name: "Orders Status",
      data: [
        totalPendingOrders,
        totalInTransitOrders,
        totalDeliveredOrders,
        totalCancelledOrders,
      ],
      color: "#5E37FF",
    },
  ];

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-gray-600">
          Orders Status
        </h2>
        <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6 dark:text-blue-500" />
        </button>
      </div>

      <div className="mt-6 md:mt-16 lg:mt-0">
        <div className="h-[300px] w-full xl:h-[400px]">
          <BarChart
            chartData={updatedBarChartData}
            chartOptions={barChartOptionsWeeklyRevenue}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;

