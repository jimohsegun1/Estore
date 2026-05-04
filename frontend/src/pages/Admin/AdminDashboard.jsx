import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      tooltip: { theme: "dark" },
      colors: ["#EC4899"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left", style: { color: "#fff" } },
      grid: { borderColor: "#374151" },
      xaxis: {
        categories: [],
        title: { text: "Date", style: { color: "#9CA3AF" } },
        labels: { style: { colors: "#9CA3AF" } },
      },
      yaxis: {
        title: { text: "Sales ($)", style: { color: "#9CA3AF" } },
        labels: { style: { colors: "#9CA3AF" } },
        min: 0,
      },
      legend: { position: "top", horizontalAlign: "right" },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSales = salesDetail.map((item) => ({ x: item._id, y: item.totalSales }));
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: formattedSales.map((i) => i.x) },
        },
        series: [{ name: "Sales", data: formattedSales.map((i) => i.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="px-4 sm:px-8">
      <AdminMenu />

      <div className="flex flex-wrap gap-4 mt-6">
        <div className="rounded-lg bg-gray-900 p-5 flex-1 min-w-[160px]">
          <div className="font-bold rounded-full w-10 h-10 bg-pink-500 flex items-center justify-center text-white mb-4">
            $
          </div>
          <p className="text-gray-400 text-sm">Total Sales</p>
          <h1 className="text-2xl font-bold mt-1">
            {loadingSales ? <Loader /> : `$ ${sales?.totalSales?.toFixed(2)}`}
          </h1>
        </div>

        <div className="rounded-lg bg-gray-900 p-5 flex-1 min-w-[160px]">
          <div className="font-bold rounded-full w-10 h-10 bg-pink-500 flex items-center justify-center text-white mb-4">
            👤
          </div>
          <p className="text-gray-400 text-sm">Customers</p>
          <h1 className="text-2xl font-bold mt-1">
            {loadingCustomers ? <Loader /> : customers?.length}
          </h1>
        </div>

        <div className="rounded-lg bg-gray-900 p-5 flex-1 min-w-[160px]">
          <div className="font-bold rounded-full w-10 h-10 bg-pink-500 flex items-center justify-center text-white mb-4">
            📦
          </div>
          <p className="text-gray-400 text-sm">All Orders</p>
          <h1 className="text-2xl font-bold mt-1">
            {loadingOrders ? <Loader /> : orders?.totalOrders}
          </h1>
        </div>
      </div>

      <div className="mt-10 w-full overflow-x-auto">
        <Chart
          options={state.options}
          series={state.series}
          type="bar"
          width="100%"
          height={350}
        />
      </div>

      <div className="mt-10">
        <OrderList />
      </div>
    </div>
  );
};

export default AdminDashboard;