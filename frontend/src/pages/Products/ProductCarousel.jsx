import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    dotsClass: "slick-dots !bottom-4",
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <Slider {...settings}>
          {products.map(({ image, _id, name, price, description }) => (
            <div key={_id} className="relative">
              <img
                src={image}
                alt={name}
                className="w-full h-56 sm:h-[26rem] object-cover"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <Link to={`/product/${_id}`}>
                  <h2 className="text-xl sm:text-3xl font-bold leading-tight mb-1 hover:text-pink-300 transition-colors">
                    {name}
                  </h2>
                </Link>
                <p className="text-pink-400 font-semibold text-lg mb-2">${price}</p>
                <p className="text-gray-300 text-sm line-clamp-2 max-w-lg hidden sm:block">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
