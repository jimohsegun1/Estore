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
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

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
    } catch (error) {
      toast.error(error?.data?.error || error.message || "Order failed");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="px-4 sm:px-10 mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="p-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                    </td>
                    <td className="p-3">
                      <Link to={`/product/${item.product}`} className="hover:text-pink-500">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3">$ {item.price.toFixed(2)}</td>
                    <td className="p-3">$ {(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

          <div className="flex flex-col sm:flex-row gap-6 bg-[#181818] rounded-lg p-6">
            <ul className="text-base space-y-2 flex-1">
              <li><span className="font-semibold">Items:</span> $ {cart.itemsPrice}</li>
              <li><span className="font-semibold">Shipping:</span> $ {cart.shippingPrice}</li>
              <li><span className="font-semibold">Tax:</span> $ {cart.taxPrice}</li>
              <li className="text-lg font-bold border-t border-gray-700 pt-2 mt-2">
                <span>Total:</span> $ {cart.totalPrice}
              </li>
            </ul>

            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Shipping</h2>
              <p className="text-sm text-gray-300">
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <p className="text-sm text-gray-300">{cart.paymentMethod}</p>
            </div>
          </div>

          {error && (
            <Message variant="danger">
              {error?.data?.error || error?.data?.message || "Something went wrong"}
            </Message>
          )}

          <button
            type="button"
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-full text-lg w-full mt-6 transition-colors disabled:opacity-50"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;