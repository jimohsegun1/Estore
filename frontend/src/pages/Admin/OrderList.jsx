import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  processing: "bg-blue-500/10 text-blue-500",
  shipped: "bg-indigo-500/10 text-indigo-500 dark:text-[#818cf8]",
  delivered: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
};

const Badge = ({ ok, yes, no }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ok ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
    {ok ? yes : no}
  </span>
);

const OrderList = ({ compact = false }) => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className={compact ? "" : "px-4 sm:px-8 py-6"}>
      {!compact && <AdminMenu />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="border-b border-[#e4e4ef] dark:border-[#2a2a45]">
                <tr className="text-[#6b6b8a] dark:text-[#7777a0] text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Order</th>
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-center">Paid</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4ef] dark:divide-[#2a2a45]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#f8f8fc] dark:hover:bg-[#17172a] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.orderItems[0]?.image} alt={order._id}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <span className="text-xs text-[#6b6b8a] dark:text-[#7777a0] font-mono truncate max-w-[80px]">
                          {order._id}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#0f0f1a] dark:text-[#ededff]">{order.user?.username || "N/A"}</td>
                    <td className="px-5 py-4 text-[#6b6b8a] dark:text-[#7777a0] text-xs">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-[#0f0f1a] dark:text-[#ededff]">${order.totalPrice}</td>
                    <td className="px-5 py-4 text-center">
                      <Badge ok={order.isPaid} yes="Paid" no="Pending" />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-500/10 text-gray-500"}`}>
                        {order.status || "pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/order/${order._id}`}
                        className="text-xs font-semibold text-indigo-500 dark:text-[#818cf8] hover:underline transition-colors">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
