import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="px-4 sm:px-10 mt-8">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : orders?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">You have no orders yet.</p>
          <Link to="/shop" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">IMAGE</th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">DATE</th>
                <th className="px-4 py-3 text-left">TOTAL</th>
                <th className="px-4 py-3 text-left">PAID</th>
                <th className="px-4 py-3 text-left">DELIVERED</th>
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
                  <td className="px-4 py-3 text-xs truncate max-w-[100px]">{order._id}</td>
                  <td className="px-4 py-3">{order.createdAt?.substring(0, 10)}</td>
                  <td className="px-4 py-3">$ {order.totalPrice}</td>
                  <td className="px-4 py-3">
                    {order.isPaid ? (
                      <span className="px-2 py-1 text-xs bg-green-500 rounded-full">Paid</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-500 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 text-xs bg-green-500 rounded-full">Delivered</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-500 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white py-1.5 px-3 rounded text-xs transition-colors">
                        View
                      </button>
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

export default UserOrder;