import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const StatCard = ({ icon, label, value, isLoading }) => (
  <div className="flex-1 min-w-[160px] bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-5 shadow-sm">
    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-[#818cf8] text-lg mb-4">
      {icon}
    </div>
    <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-[#0f0f1a] dark:text-[#ededff]">{isLoading ? "—" : value}</p>
  </div>
);

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const isDark = theme === "dark";
  const gridColor = isDark ? "#2a2a45" : "#e4e4ef";
  const labelColor = isDark ? "#7777a0" : "#6b6b8a";
  const textColor = isDark ? "#ededff" : "#0f0f1a";
  const bgColor = isDark ? "#0f0f1c" : "#ffffff";

  const [state, setState] = useState({
    options: {
      chart: { type: "area", toolbar: { show: false }, background: "transparent" },
      tooltip: { theme: isDark ? "dark" : "light" },
      colors: ["#6366f1"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0, stops: [0, 100] } },
      title: {
        text: "Sales over time",
        align: "left",
        style: { color: textColor, fontSize: "16px", fontWeight: "700" },
      },
      grid: { borderColor: gridColor, strokeDashArray: 4 },
      xaxis: {
        categories: [],
        labels: { style: { colors: labelColor, fontSize: "12px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: labelColor, fontSize: "12px" }, formatter: (v) => `$${v}` },
        min: 0,
      },
      legend: { show: false },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        tooltip: { theme: isDark ? "dark" : "light" },
        title: { ...prev.options.title, style: { ...prev.options.title.style, color: textColor } },
        grid: { borderColor: gridColor, strokeDashArray: 4 },
        xaxis: { ...prev.options.xaxis, labels: { style: { colors: labelColor, fontSize: "12px" } } },
        yaxis: { labels: { style: { colors: labelColor, fontSize: "12px" }, formatter: (v) => `$${v}` }, min: 0 },
      },
    }));
  }, [theme]);

  useEffect(() => {
    if (salesDetail) {
      const formatted = salesDetail.map((item) => ({ x: item._id, y: item.totalSales }));
      setState((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: { ...prev.options.xaxis, categories: formatted.map((i) => i.x) },
        },
        series: [{ name: "Sales", data: formatted.map((i) => i.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <h1 className="text-2xl font-bold tracking-tight mb-6 text-[#0f0f1a] dark:text-[#ededff]">Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon="$" label="Total Revenue" value={`$${sales?.totalSales?.toFixed(2)}`} isLoading={loadingSales} />
        <StatCard icon="👤" label="Customers" value={customers?.length} isLoading={loadingCustomers} />
        <StatCard icon="📦" label="Total Orders" value={orders?.totalOrders} isLoading={loadingOrders} />
      </div>

      <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-6 mb-8 overflow-x-auto shadow-sm">
        <Chart options={state.options} series={state.series} type="area" width="100%" height={300} />
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-[#0f0f1a] dark:text-[#ededff]">Recent Orders</h2>
        <OrderList compact />
      </div>
    </div>
  );
};

export default AdminDashboard;
