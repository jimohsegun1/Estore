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
        paypalDispatch({ type: "resetOptions", value: { "client-id": paypal.clientId, currency: "USD" } });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid && !window.paypal) loadPayPalScript();
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
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

  if (isLoading) return <Loader />;
  if (error) return (
    <div className="px-4 mt-6">
      <Message variant="danger">{error?.data?.message || error.message}</Message>
    </div>
  );

  return (
    <div className="px-4 sm:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Order details</h1>
      <p className="text-gray-500 text-sm mb-8 font-mono">{order._id}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden mb-6">
            {order.orderItems.length === 0 ? (
              <div className="p-6">
                <Message>Order is empty</Message>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[480px]">
                  <thead className="border-b border-[#2a2a2a]">
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Product</th>
                      <th className="px-5 py-3 text-center">Qty</th>
                      <th className="px-5 py-3 text-right">Price</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {order.orderItems.map((item, i) => (
                      <tr key={i}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                            <Link to={`/product/${item.product}`} className="font-medium hover:text-pink-400 transition-colors">
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-400">{item.qty}</td>
                        <td className="px-5 py-4 text-right text-gray-400">${item.price}</td>
                        <td className="px-5 py-4 text-right font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0 space-y-4">
          {/* Shipping info */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-sm space-y-2">
            <h2 className="font-bold text-base mb-3">Shipping</h2>
            <p className="text-gray-400"><span className="text-white font-medium">Name:</span> {order.user.username}</p>
            <p className="text-gray-400"><span className="text-white font-medium">Email:</span> {order.user.email}</p>
            <p className="text-gray-400">
              <span className="text-white font-medium">Address:</span>{" "}
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p className="text-gray-400"><span className="text-white font-medium">Payment:</span> {order.paymentMethod}</p>
            <div className="pt-2">
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt?.substring(0, 10)}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </div>
            <div>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt?.substring(0, 10)}</Message>
              ) : (
                <Message variant="warning">Not delivered</Message>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-sm">
            <h2 className="font-bold text-base mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Items</span><span className="text-white">${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span><span className="text-white">${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span><span className="text-white">${order.taxPrice}</span>
              </div>
              <div className="border-t border-[#2a2a2a] pt-3 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-pink-400">${order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* PayPal */}
          {!order.isPaid && (
            <div>
              {loadingPay && <Loader />}
              {isPending ? <Loader /> : (
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              onClick={deliverHandler}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
