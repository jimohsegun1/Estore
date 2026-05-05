import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Message from "../components/Message";
import Header from "../components/Header";
import ProductCard from "./Products/ProductCard";
import Pagination from "../components/Pagination";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";

const Home = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, isError } = useGetProductsQuery({ page, pageSize: 12, sortBy });

  return (
    <>
      <Header />

      <div className="px-4 sm:px-8 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0f0f1a] dark:text-[#ededff]">
              Featured Products
            </h2>
            {data && (
              <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm mt-0.5">
                {data.count} items
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-[#f1f1f7] dark:bg-[#17172a] border border-[#e4e4ef] dark:border-[#2a2a45] text-[#0f0f1a] dark:text-[#ededff] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <Link to="/shop"
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl px-5 py-2 text-sm transition-all shadow-brand-sm hover:shadow-brand-md">
              View all →
            </Link>
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : isError ? (
          <Message variant="danger">{isError?.data?.message || isError.error}</Message>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.products.map((product) => (
                <ProductCard key={product._id} p={product} />
              ))}
            </div>

            <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
};

export default Home;
