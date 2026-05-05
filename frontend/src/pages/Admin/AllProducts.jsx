import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />
      <Loader />
    </div>
  );

  if (isError) return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />
      <p className="text-red-400">Error loading products.</p>
    </div>
  );

  return (
    <div className="px-4 sm:px-8 py-6">
      <AdminMenu />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
        <span className="text-gray-500 text-sm">{products.length} items</span>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="border-b border-[#2a2a2a]">
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Added</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-[#242424] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{product.name}</p>
                        <p className="text-gray-500 text-xs truncate max-w-xs hidden sm:block">
                          {product.description?.substring(0, 60)}…
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-pink-400">${product.price}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs hidden sm:table-cell">
                    {moment(product.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
