import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1 className="text-center text-red-500 mt-4">Failed to load products</h1>;

  return (
    <div className="flex flex-col lg:flex-row justify-around items-start gap-4 px-4 mt-4">
      <div className="hidden xl:grid grid-cols-2 gap-2 flex-shrink-0">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>
      <div className="w-full xl:flex-1">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;