import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const Badge = ({ ok }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
    }`}
  >
    {ok ? "Paid" : "Pending"}
  </span>
);

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="px-4 sm:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">My Orders</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-gray-400 font-medium mb-1">No orders yet</p>
          <p className="text-gray-600 text-sm mb-5">Your orders will appear here once you place one.</p>
          <Link
            to="/shop"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors text-sm"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="border-b border-[#2a2a2a]">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Order</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-center">Paid</th>
                  <th className="px-5 py-3 text-center">Delivered</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#242424] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.orderItems[0]?.image}
                          alt={order._id}
                          className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <span className="text-xs text-gray-500 font-mono truncate max-w-[80px]">{order._id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-5 py-4 text-right font-semibold">${order.totalPrice}</td>
                    <td className="px-5 py-4 text-center"><Badge ok={order.isPaid} /></td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.isDelivered ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {order.isDelivered ? "Delivered" : "In transit"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-pink-400 hover:text-pink-300 text-xs font-semibold transition-colors"
                      >
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

export default UserOrder;
