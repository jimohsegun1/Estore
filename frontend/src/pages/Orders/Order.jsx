import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({ purchase_units: [{ amount: { value: order.totalPrice } }] })
      .then((orderID) => orderID);
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.message}</Message>
  ) : (
    <div className="px-4 sm:px-8 mt-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: order items */}
        <div className="flex-1 min-w-0">
          <div className="border border-gray-700 rounded-lg pb-4 mb-6 overflow-hidden">
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="p-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                        </td>
                        <td className="p-3">
                          <Link to={`/product/${item.product}`} className="hover:text-pink-500">
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right">$ {item.price}</td>
                        <td className="p-3 text-right">$ {(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: summary */}
        <div className="lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-gray-900 rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4">Shipping</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-pink-500 font-semibold">Order:</span> {order._id}</p>
              <p><span className="text-pink-500 font-semibold">Name:</span> {order.user.username}</p>
              <p><span className="text-pink-500 font-semibold">Email:</span> {order.user.email}</p>
              <p>
                <span className="text-pink-500 font-semibold">Address:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <p><span className="text-pink-500 font-semibold">Method:</span> {order.paymentMethod}</p>
            </div>

            <div className="mt-4">
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt?.substring(0, 10)}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Items</span><span>$ {order.itemsPrice}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$ {order.shippingPrice}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>$ {order.taxPrice}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-700 pt-2 mt-2">
                <span>Total</span><span>$ {order.totalPrice}</span>
              </div>
            </div>
          </div>

          {!order.isPaid && (
            <div>
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-lg transition-colors"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;