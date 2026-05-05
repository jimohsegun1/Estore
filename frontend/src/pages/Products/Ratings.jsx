import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color = "yellow-500" }) => {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className={`text-${color}`} size={14} />
      ))}
      {halfStar === 1 && <FaStarHalfAlt className={`text-${color}`} size={14} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className={`text-${color}`} size={14} />
      ))}
      {text && <span className="ml-2 text-sm text-gray-400">{text}</span>}
    </div>
  );
};

export default Ratings;
