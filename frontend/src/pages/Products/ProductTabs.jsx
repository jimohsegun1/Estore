import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Tab buttons */}
      <section className="flex md:flex-col gap-2 md:gap-0 md:mr-8 border-b md:border-b-0 md:border-r border-gray-700 pb-4 md:pb-0 md:pr-4">
        {[
          { id: 1, label: "Write Your Review" },
          { id: 2, label: "All Reviews" },
          { id: 3, label: "Related Products" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left p-3 rounded-lg text-sm sm:text-base whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-pink-600 text-white font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Tab content */}
      <section className="flex-1 min-w-0">
        {activeTab === 1 && (
          <div className="mt-2">
            {userInfo ? (
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="rating" className="block text-lg mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full max-w-md text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-lg mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full max-w-md text-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {loadingProductReview ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : (
              <p>
                Please{" "}
                <Link to="/login" className="text-pink-500 underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet. Be the first!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-[#1A1A1A] p-4 rounded-lg w-full max-w-2xl"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-[#B0B0B0]">{review.name}</strong>
                      <span className="text-[#B0B0B0] text-sm">
                        {review.createdAt.substring(0, 10)}
                      </span>
                    </div>
                    <p className="my-3">{review.comment}</p>
                    <Ratings value={review.rating} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="flex flex-wrap gap-2">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;