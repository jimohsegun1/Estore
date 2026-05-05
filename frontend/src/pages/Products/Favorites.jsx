import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import ProductCard from "./ProductCard";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="px-4 sm:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        <p className="text-gray-500 text-sm mt-1">{favorites.length} saved item{favorites.length !== 1 ? "s" : ""}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
            <span className="text-2xl">🤍</span>
          </div>
          <p className="text-gray-400 font-medium mb-1">No favorites yet</p>
          <p className="text-gray-600 text-sm">Heart a product on any listing to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favorites.map((product) => (
            <ProductCard key={product._id} p={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
