import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-[16rem] p-3">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-36 object-cover rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center gap-2">
            <div className="truncate text-sm">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 whitespace-nowrap">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;