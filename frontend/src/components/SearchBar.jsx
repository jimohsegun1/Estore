import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { useGetProductsQuery } from "../redux/api/productApiSlice";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useGetProductsQuery(
    { keyword: debouncedQuery, pageSize: 5 },
    { skip: debouncedQuery.length < 2 }
  );

  const results = data?.products || [];

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <HiMagnifyingGlass
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b8a] dark:text-[#7777a0] pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-[#f1f1f7] dark:bg-[#17172a] border border-[#e4e4ef] dark:border-[#2a2a45]
            text-[#0f0f1a] dark:text-[#ededff] placeholder-[#6b6b8a] dark:placeholder-[#7777a0]
            rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b8a] dark:text-[#7777a0] hover:text-[#0f0f1a] dark:hover:text-[#ededff]"
          >
            <HiXMark size={16} />
          </button>
        )}
      </form>

      {debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl shadow-brand-md overflow-hidden z-50 animate-slide-up">
          {isFetching ? (
            <div className="px-4 py-3 text-sm text-[#6b6b8a] dark:text-[#7777a0]">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#6b6b8a] dark:text-[#7777a0]">No results for "{debouncedQuery}"</div>
          ) : (
            <>
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSelect(product._id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] transition-colors text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0f0f1a] dark:text-[#ededff] truncate">{product.name}</p>
                    <p className="text-xs text-indigo-500 dark:text-[#818cf8] font-semibold">${product.price}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2.5 text-xs font-semibold text-indigo-500 dark:text-[#818cf8] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] border-t border-[#e4e4ef] dark:border-[#2a2a45] transition-colors"
              >
                View all results for "{debouncedQuery}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
