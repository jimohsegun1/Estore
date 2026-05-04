import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="px-4 sm:px-8">
      <AdminMenu />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-gray-700 bg-gray-900">
              <tr>
                <th className="text-left px-4 py-3">IMAGE</th>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">USER</th>
                <th className="text-left px-4 py-3">DATE</th>
                <th className="text-left px-4 py-3">TOTAL</th>
                <th className="text-left px-4 py-3">PAID</th>
                <th className="text-left px-4 py-3">DELIVERED</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="px-4 py-3">
                    <img
                      src={order.orderItems[0]?.image}
                      alt={order._id}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-xs truncate max-w-[120px]">{order._id}</td>
                  <td className="px-4 py-3">{order.user ? order.user.username : "N/A"}</td>
                  <td className="px-4 py-3">{order.createdAt?.substring(0, 10) || "N/A"}</td>
                  <td className="px-4 py-3">$ {order.totalPrice}</td>
                  <td className="px-4 py-3">
                    {order.isPaid ? (
                      <span className="px-2 py-1 text-xs text-center bg-green-500 rounded-full">Paid</span>
                    ) : (
                      <span className="px-2 py-1 text-xs text-center bg-red-500 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 text-xs text-center bg-green-500 rounded-full">Delivered</span>
                    ) : (
                      <span className="px-2 py-1 text-xs text-center bg-red-500 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;