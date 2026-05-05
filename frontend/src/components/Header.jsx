import ProductCarousel from "../pages/Products/ProductCarousel";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";

const Header = () => {
  const { isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-red-400 mt-4">Failed to load featured products</p>;

  return (
    <div className="px-4 sm:px-6 mt-4">
      <ProductCarousel />
    </div>
  );
};

export default Header;
