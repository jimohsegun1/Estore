import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/shop" className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="text-pink-500 hover:underline truncate block">
                    {item.name}
                  </Link>
                  <div className="text-gray-400 text-sm mt-1">{item.brand}</div>
                  <div className="font-bold mt-1">$ {item.price}</div>
                </div>

                <select
                  className="p-1 border rounded text-black w-16"
                  value={item.qty}
                  onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="text-red-500 hover:text-red-700 p-2"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
              </h2>
              <div className="text-2xl font-bold mb-6">
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </div>

              <button
                className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-full text-lg w-full transition-colors disabled:opacity-50"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;