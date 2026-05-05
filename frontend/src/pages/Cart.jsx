import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => dispatch(addToCart({ ...product, qty }));
  const removeFromCartHandler = (id) => dispatch(removeFromCart(id));
  const checkoutHandler = () => navigate("/login?redirect=/shipping");

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const selectClass =
    "bg-[#f1f1f7] dark:bg-[#17172a] border border-[#e4e4ef] dark:border-[#2a2a45] text-[#0f0f1a] dark:text-[#ededff] rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-20 flex-shrink-0 transition-colors";

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] flex items-center justify-center mb-5 shadow-sm">
          <span className="text-3xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#0f0f1a] dark:text-[#ededff]">Your cart is empty</h2>
        <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm mb-6">Add some products to get started.</p>
        <Link to="/shop"
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl px-6 py-2.5 transition-all shadow-brand-sm">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8 text-[#0f0f1a] dark:text-[#ededff]">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-3">
          {cartItems.map((item) => (
            <div key={item._id}
              className="flex items-center gap-4 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-4 shadow-sm">
              <img src={item.image} alt={item.name}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <Link to={`/product/${item._id}`}
                  className="font-semibold text-sm text-[#0f0f1a] dark:text-[#ededff] hover:text-indigo-500 dark:hover:text-[#818cf8] transition-colors line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-[#6b6b8a] dark:text-[#7777a0] text-xs mt-0.5">{item.brand}</p>
                <p className="text-indigo-500 dark:text-[#818cf8] font-bold mt-1">${item.price}</p>
              </div>

              <select className={selectClass} value={item.qty}
                onChange={(e) => addToCartHandler(item, Number(e.target.value))}>
                {[...Array(item.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>

              <button onClick={() => removeFromCartHandler(item._id)}
                className="p-2 text-[#6b6b8a] dark:text-[#7777a0] hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove item">
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-6 sticky top-4 shadow-sm">
            <h2 className="font-bold text-lg mb-5 text-[#0f0f1a] dark:text-[#ededff]">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-[#6b6b8a] dark:text-[#7777a0]">
                <span>Items ({totalItems})</span>
                <span className="text-[#0f0f1a] dark:text-[#ededff] font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b8a] dark:text-[#7777a0]">
                <span>Shipping</span>
                <span className="text-[#0f0f1a] dark:text-[#ededff] font-medium">At checkout</span>
              </div>
              <div className="border-t border-[#e4e4ef] dark:border-[#2a2a45] pt-3 flex justify-between font-bold">
                <span className="text-[#0f0f1a] dark:text-[#ededff]">Total</span>
                <span className="text-indigo-500 dark:text-[#818cf8] text-lg">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={checkoutHandler}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl py-3 transition-all shadow-brand-sm hover:shadow-brand-md">
              Proceed to Checkout
            </button>

            <Link to="/shop"
              className="block text-center mt-3 text-sm text-[#6b6b8a] dark:text-[#7777a0] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
