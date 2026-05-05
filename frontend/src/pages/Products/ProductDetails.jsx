import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductByIdQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="px-4 sm:px-8 pb-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mt-4 mb-6"
      >
        ← Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Image */}
            <div className="relative flex-shrink-0 lg:w-[36rem]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-2xl object-cover aspect-[4/3]"
              />
              <HeartIcon product={product} />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-5">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              </div>

              <p className="text-4xl font-extrabold text-white">${product.price}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: <FaStore size={13} />, label: "Brand", val: product.brand },
                  { icon: <FaStar size={13} />, label: "Rating", val: `${Math.round(product.rating)} / 5` },
                  { icon: <FaClock size={13} />, label: "Added", val: moment(product.createdAt).fromNow() },
                  { icon: <FaShoppingCart size={13} />, label: "Qty", val: product.quantity },
                  { icon: <FaStar size={13} />, label: "Reviews", val: product.numReviews },
                  { icon: <FaBox size={13} />, label: "In Stock", val: product.countInStock },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2 text-gray-400">
                    <span className="text-gray-500">{icon}</span>
                    <span className="text-gray-500">{label}:</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>

              <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {product.countInStock > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Quantity</label>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="bg-[#0f0f0f] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-8 py-2.5 transition-colors"
                  >
                    {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-[#2a2a2a] pt-10">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
