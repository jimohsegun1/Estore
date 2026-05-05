import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart");
  };

  return (
    <div className="w-full sm:w-64 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl overflow-hidden hover:shadow-brand-md hover:border-indigo-300 dark:hover:border-[#4a4a70] transition-all flex flex-col group">
      <div className="relative flex-shrink-0 overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <HeartIcon product={p} />
        {p?.brand && (
          <span className="absolute bottom-2 left-2 bg-black/50 dark:bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
            {p.brand}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h5 className="font-semibold text-sm leading-snug line-clamp-2 flex-1 text-[#0f0f1a] dark:text-[#ededff]">
            {p?.name}
          </h5>
          <p className="font-bold text-indigo-500 dark:text-[#818cf8] text-sm whitespace-nowrap">
            {p?.price?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
        </div>

        <p className="text-xs text-[#6b6b8a] dark:text-[#7777a0] line-clamp-2 flex-1 mb-4">
          {p?.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <Link to={`/product/${p._id}`}
            className="text-xs font-semibold text-indigo-500 dark:text-[#818cf8] hover:underline transition-colors">
            View details →
          </Link>
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 flex items-center justify-center transition-all shadow-brand-sm hover:shadow-brand-md active:scale-95"
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
