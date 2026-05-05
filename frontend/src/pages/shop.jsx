import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsMutation } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setSortBy,
} from "../redux/features/shop/shopSlice";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import ProductCard from "./Products/ProductCard";
import { FiFilter, FiX } from "react-icons/fi";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio, sortBy } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filterProducts, { isLoading }] = useGetFilteredProductsMutation();

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    filterProducts({ checked, radio, sortBy }).then((res) => {
      if (res.data) {
        const filtered = res.data.filter((p) =>
          priceFilter
            ? p.price.toString().includes(priceFilter) || p.price === parseInt(priceFilter, 10)
            : true
        );
        dispatch(setProducts(filtered));
      }
    });
  }, [checked, radio, sortBy, priceFilter]);

  const handleBrandClick = (brand) => {
    filterProducts({ checked, radio, sortBy }).then((res) => {
      if (res.data) dispatch(setProducts(res.data.filter((p) => p.brand === brand)));
    });
  };

  const handleCheck = (value, id) => {
    const updated = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updated));
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    setPriceFilter("");
    dispatch(setSortBy("newest"));
    filterProducts({ checked: [], radio: [], sortBy: "newest" }).then((res) => {
      if (res.data) dispatch(setProducts(res.data));
    });
  };

  const uniqueBrands = [...new Set(products?.map((p) => p.brand).filter(Boolean))];

  const inputClass =
    "w-full bg-[#f1f1f7] dark:bg-[#17172a] border border-[#e4e4ef] dark:border-[#2a2a45] text-[#0f0f1a] dark:text-[#ededff] placeholder-[#6b6b8a] dark:placeholder-[#7777a0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";

  const FilterPanel = () => (
    <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-[#6b6b8a] dark:text-[#7777a0] uppercase tracking-widest">Filters</h3>
        <button onClick={handleReset} className="text-xs text-indigo-500 dark:text-[#818cf8] hover:underline">
          Reset
        </button>
      </div>

      {/* Sort */}
      <h4 className="text-xs font-semibold text-[#6b6b8a] dark:text-[#7777a0] uppercase tracking-widest mb-2">Sort by</h4>
      <select
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
        className={`${inputClass} mb-5`}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="rating">Top Rated</option>
      </select>

      <h4 className="text-xs font-semibold text-[#6b6b8a] dark:text-[#7777a0] uppercase tracking-widest mb-3">Categories</h4>
      <div className="space-y-2 mb-5">
        {categories?.map((c) => (
          <label key={c._id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked.includes(c._id)}
              onChange={(e) => handleCheck(e.target.checked, c._id)}
              className="w-4 h-4 rounded border-[#e4e4ef] dark:border-[#2a2a45] bg-transparent text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 accent-indigo-500"
            />
            <span className="text-sm text-[#6b6b8a] dark:text-[#7777a0] group-hover:text-[#0f0f1a] dark:group-hover:text-[#ededff] transition-colors">
              {c.name}
            </span>
          </label>
        ))}
      </div>

      {uniqueBrands.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-[#6b6b8a] dark:text-[#7777a0] uppercase tracking-widest mb-3">Brands</h4>
          <div className="space-y-2 mb-5">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 border-[#e4e4ef] dark:border-[#2a2a45] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 accent-indigo-500"
                />
                <span className="text-sm text-[#6b6b8a] dark:text-[#7777a0] group-hover:text-[#0f0f1a] dark:group-hover:text-[#ededff] transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </>
      )}

      <h4 className="text-xs font-semibold text-[#6b6b8a] dark:text-[#7777a0] uppercase tracking-widest mb-2">Price</h4>
      <input
        type="text"
        placeholder="e.g. 50"
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="lg:hidden flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f0f1a] dark:text-[#ededff]">Shop</h1>
          <p className="text-[#6b6b8a] dark:text-[#7777a0] text-xs mt-0.5">{products?.length} products</p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] text-sm px-4 py-2 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-600 text-[#0f0f1a] dark:text-[#ededff] transition-colors"
        >
          {filtersOpen ? <FiX size={16} /> : <FiFilter size={16} />}
          {filtersOpen ? "Hide" : "Filters"}
        </button>
      </div>

      {filtersOpen && (
        <div className="lg:hidden mb-6">
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden lg:block w-60 flex-shrink-0">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#0f0f1a] dark:text-[#ededff]">Shop</h1>
            <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm mt-0.5">{products?.length} products</p>
          </div>
          <FilterPanel />
        </div>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[#0f0f1a] dark:text-[#ededff] font-medium mb-1">No products found</p>
              <p className="text-[#6b6b8a] dark:text-[#7777a0] text-sm">Try adjusting your filters.</p>
              <button onClick={handleReset}
                className="mt-4 text-indigo-500 dark:text-[#818cf8] hover:underline text-sm">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
