import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-44 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-gray-600 transition-colors">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover"
        />
        <HeartIcon product={product} />
      </div>
      <div className="p-3">
        <Link to={`/product/${product._id}`} className="hover:text-pink-400 transition-colors">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-pink-400 text-sm font-semibold mt-1">${product.price}</p>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
