import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full sm:w-60 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-gray-600 transition-colors">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
        <HeartIcon product={product} />
      </div>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="hover:text-pink-400 transition-colors">
          <p className="font-semibold truncate">{product.name}</p>
          <p className="text-pink-400 font-bold mt-1">${product.price}</p>
        </Link>
      </div>
    </div>
  );
};

export default Product;
