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
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="px-4 sm:px-10">
        <Link to="/" className="text-white font-semibold hover:underline">
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="px-4 sm:px-10 mt-6">
          <div className="flex flex-col lg:flex-row gap-8 relative">
            {/* Image */}
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full lg:w-[40rem] rounded-lg object-cover"
              />
              <HeartIcon product={product} />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between gap-4">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-[#B0B0B0] max-w-xl">{product.description}</p>
              <p className="text-4xl font-extrabold">$ {product.price}</p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <span className="flex items-center gap-2">
                  <FaStore className="text-white" /> Brand: {product.brand}
                </span>
                <span className="flex items-center gap-2">
                  <FaStar className="text-white" /> Rating: {Math.round(product.rating)}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="text-white" /> Added: {moment(product.createdAt).fromNow()}
                </span>
                <span className="flex items-center gap-2">
                  <FaShoppingCart className="text-white" /> Qty: {product.quantity}
                </span>
                <span className="flex items-center gap-2">
                  <FaStar className="text-white" /> Reviews: {product.numReviews}
                </span>
                <span className="flex items-center gap-2">
                  <FaBox className="text-white" /> In Stock: {product.countInStock}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 w-24 rounded-lg text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
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
        </div>
      )}
    </>
  );
};

export default ProductDetails;