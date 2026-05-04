import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full max-w-[50rem] mb-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider {...settings}>
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-48 sm:h-[30rem]"
                />

                <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4 px-1">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <p className="text-pink-400">$ {price}</p>
                    <p className="mt-2 text-sm text-gray-300 line-clamp-3 sm:w-[25rem]">
                      {description.substring(0, 170)}...
                    </p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div className="flex flex-col gap-3">
                      <span className="flex items-center gap-1">
                        <FaStore className="text-white" /> {brand}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="text-white" /> {moment(createdAt).fromNow()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaStar className="text-white" /> {numReviews} reviews
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="flex items-center gap-1">
                        <FaStar className="text-white" /> {Math.round(rating)} / 5
                      </span>
                      <span className="flex items-center gap-1">
                        <FaShoppingCart className="text-white" /> Qty: {quantity}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBox className="text-white" /> Stock: {countInStock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;