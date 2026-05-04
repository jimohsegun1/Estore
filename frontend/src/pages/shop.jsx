import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((product) =>
        priceFilter
          ? product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          : true
      );
      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    setPriceFilter("");
    if (filteredProductsQuery.data) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

  const FilterPanel = () => (
    <div className="bg-[#151515] p-4">
      <h2 className="text-center py-2 bg-black rounded-full mb-3 font-semibold">
        Filter by Categories
      </h2>
      <div className="p-3 w-full sm:w-[15rem]">
        {categories?.map((c) => (
          <div key={c._id} className="mb-2 flex items-center">
            <input
              type="checkbox"
              id={`cat-${c._id}`}
              checked={checked.includes(c._id)}
              onChange={(e) => handleCheck(e.target.checked, c._id)}
              className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
            />
            <label
              htmlFor={`cat-${c._id}`}
              className="ml-2 text-sm font-medium text-white cursor-pointer"
            >
              {c.name}
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-center py-2 bg-black rounded-full mb-3 font-semibold">
        Filter by Brands
      </h2>
      <div className="p-3">
        {uniqueBrands?.map((brand) => (
          <div key={brand} className="flex items-center mb-4 cursor-pointer">
            <input
              type="radio"
              id={`brand-${brand}`}
              name="brand"
              onChange={() => handleBrandClick(brand)}
              className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 cursor-pointer"
            />
            <label
              htmlFor={`brand-${brand}`}
              className="ml-2 text-sm font-medium text-white cursor-pointer"
            >
              {brand}
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-center py-2 bg-black rounded-full mb-3 font-semibold">
        Filter by Price
      </h2>
      <div className="p-3 w-full sm:w-[15rem]">
        <input
          type="text"
          placeholder="Enter Price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300 text-black"
        />
      </div>

      <div className="p-3 pt-0">
        <button
          className="w-full border border-white py-2 rounded hover:bg-white hover:text-black transition-colors my-2"
          onClick={handleReset}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-2">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex items-center justify-between p-3 mb-2">
        <h2 className="font-semibold">{products?.length} Products</h2>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg"
        >
          {filtersOpen ? <FiX size={18} /> : <FiFilter size={18} />}
          {filtersOpen ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="lg:hidden mb-4">
          <FilterPanel />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <FilterPanel />
        </div>

        {/* Products grid */}
        <div className="flex-1 p-2">
          <h2 className="hidden lg:block text-center mb-4 font-semibold">
            {products?.length} Products
          </h2>

          {filteredProductsQuery.isLoading ? (
            <Loader />
          ) : products?.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              No products found. Try resetting your filters.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {products?.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;