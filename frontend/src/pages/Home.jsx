import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 mt-8 sm:mt-10 gap-4">
            <h1 className="text-2xl sm:text-[3rem] font-light">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 hover:bg-pink-700 transition-colors"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-6 gap-2 px-2">
            {data.products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;