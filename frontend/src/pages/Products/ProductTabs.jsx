import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const TABS = [
  { id: 1, label: "Write Review" },
  { id: 2, label: "All Reviews" },
  { id: 3, label: "Related Products" },
];

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

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === tab.id
                ? "bg-pink-600 text-white"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 1 && (
        <div className="max-w-lg">
          {userInfo ? (
            <form onSubmit={submitHandler} className="flex flex-col gap-5">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-400 mb-1.5">
                  Rating
                </label>
                <select
                  id="rating"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 — Inferior</option>
                  <option value="2">2 — Decent</option>
                  <option value="3">3 — Great</option>
                  <option value="4">4 — Excellent</option>
                  <option value="5">5 — Exceptional</option>
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-1.5">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience…"
                  className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProductReview}
                className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors w-fit"
              >
                {loadingProductReview ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-gray-400">
              Please{" "}
              <Link to="/login" className="text-pink-400 hover:text-pink-300 underline underline-offset-2">
                sign in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div>
          {product.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          ) : (
            <div className="flex flex-col gap-4 max-w-2xl">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-sm">{review.name}</span>
                    <span className="text-gray-500 text-xs">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-3 text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 3 && (
        <div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap gap-3">
              {data?.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
