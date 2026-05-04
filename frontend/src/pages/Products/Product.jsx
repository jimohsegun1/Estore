import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full sm:w-[22rem] p-3 relative">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded object-cover h-48 sm:h-60"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center gap-2">
            <div className="text-lg truncate">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 whitespace-nowrap">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;