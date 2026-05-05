import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || "Order failed");
    }
  };

  return (
    <div className="px-4 py-6">
      <ProgressSteps step1 step2 step3 />

      {cart.cartItems.length === 0 ? (
        <div className="px-4">
          <Message>Your cart is empty</Message>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 px-0 sm:px-4 mt-4">
          {/* Items table */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold mb-4 tracking-tight">Your Items</h2>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead className="border-b border-[#2a2a2a]">
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-5 py-3 text-left">Product</th>
                      <th className="px-5 py-3 text-center">Qty</th>
                      <th className="px-5 py-3 text-right">Price</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {cart.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                            />
                            <Link
                              to={`/product/${item.product}`}
                              className="font-medium hover:text-pink-400 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-400">{item.qty}</td>
                        <td className="px-5 py-4 text-right text-gray-400">${item.price.toFixed(2)}</td>
                        <td className="px-5 py-4 text-right font-semibold">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:w-80 flex-shrink-0 space-y-4">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Items</span>
                  <span className="text-white">${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">${cart.taxPrice}</span>
                </div>
                <div className="border-t border-[#2a2a2a] pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-pink-400">${cart.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 text-sm space-y-2">
              <p className="font-semibold text-gray-300 mb-3">Delivery details</p>
              <p className="text-gray-400">
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
              <p className="text-gray-500 pt-1">
                Payment via <span className="text-white">{cart.paymentMethod}</span>
              </p>
            </div>

            {error && (
              <Message variant="danger">
                {error?.data?.error || error?.data?.message || "Something went wrong"}
              </Message>
            )}

            <button
              type="button"
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition-colors"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? "Placing order…" : "Place Order"}
            </button>

            {isLoading && <Loader />}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
