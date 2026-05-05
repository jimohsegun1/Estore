import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const inputClass =
  "w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 focus:border-pink-500 focus:outline-none transition-colors";
const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="px-4 py-6">
      <ProgressSteps step1 step2 />

      <div className="flex justify-center mt-6">
        <div className="w-full max-w-lg bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Shipping address</h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className={labelClass}>Street address</label>
              <input
                type="text"
                className={inputClass}
                placeholder="123 Main St"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="New York"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Postal code</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="10001"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                className={inputClass}
                placeholder="United States"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Payment method</label>
              <label className="flex items-center gap-3 bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 cursor-pointer hover:border-pink-500 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-pink-600"
                />
                <span className="text-sm font-medium">PayPal or Credit Card</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl py-3 transition-colors"
            >
              Continue to Order Summary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
