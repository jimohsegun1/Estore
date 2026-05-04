import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="px-4 sm:px-10 mt-8">
      <h1 className="text-xl font-bold mb-6">FAVORITE PRODUCTS</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No favorites yet. Heart a product to save it here.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
