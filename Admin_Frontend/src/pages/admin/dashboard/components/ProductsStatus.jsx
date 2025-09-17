import PieChart from "../../../../components/charts/PieChart";
import { pieChartOptions } from "../../../../variables/charts";
import Card from "../../../../components/card";
import { useEffect, useState } from "react";
import api from "../../../../http/ApiService";

const ProductsStatus = () => {
  const [datas, setDatas] = useState({ allProducts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await api.getDatas("admin/misc/datas");
        setDatas(result || { allProducts: [] });
        setError(null);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load product data. Please try again later.");
        setDatas({ allProducts: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch the count of product status: available and unavailable from datas.allProducts
  const allAvailableProducts = datas.allProducts?.filter(
    (product) => product.productStatus === "Available"
  );
  const totalAvailableProducts = allAvailableProducts?.length || 0;

  const allUnavailableProducts = datas.allProducts?.filter(
    (product) => product.productStatus === "Unavailable"
  );
  const totalUnavailableProducts = allUnavailableProducts?.length || 0;

  // Pie chart series (array of numbers)
  const pieChartData = [totalAvailableProducts, totalUnavailableProducts];

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-gray-700">
            Product Status
          </h4>
        </div>
      </div>

      <div className="mt-18 flex h-[300px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>
    </Card>
  );
};

export default ProductsStatus;