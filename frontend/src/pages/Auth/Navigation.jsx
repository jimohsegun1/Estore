import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const favoriteCount = favorites.length;

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
      isActive(path)
        ? "bg-pink-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* ── Desktop Sidebar (lg+) ── */}
      <div
        style={{ zIndex: 999 }}
        className="hidden lg:flex flex-col justify-between pt-6 pb-6 px-3 text-white bg-[#0f0f0f] h-[100vh] fixed top-0 left-0 border-r border-gray-800"
        id="navigation-container"
      >
        {/* Top: brand + nav links */}
        <div className="flex flex-col gap-1">
          {/* Brand */}
          <div className="flex items-center gap-3 px-3 py-3 mb-4">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
              E
            </div>
            <span className="nav-item-name font-bold text-lg text-white">Estore</span>
          </div>

          <Link to="/" className={navLinkClass("/")}>
            <AiOutlineHome size={22} className="flex-shrink-0" />
            <span className="nav-item-name text-sm font-medium">Home</span>
          </Link>

          <Link to="/shop" className={navLinkClass("/shop")}>
            <AiOutlineShopping size={22} className="flex-shrink-0" />
            <span className="nav-item-name text-sm font-medium">Shop</span>
          </Link>

          <Link to="/cart" className={`${navLinkClass("/cart")} relative`}>
            <div className="relative flex-shrink-0">
              <AiOutlineShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="nav-item-name text-sm font-medium">Cart</span>
          </Link>

          <Link to="/favorite" className={`${navLinkClass("/favorite")} relative`}>
            <div className="relative flex-shrink-0">
              <FaHeart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </div>
            <span className="nav-item-name text-sm font-medium">Favorites</span>
          </Link>
        </div>

        {/* Bottom: user section */}
        <div className="flex flex-col gap-1">
          {userInfo ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
              >
                <FaUserCircle size={22} className="flex-shrink-0 text-pink-400" />
                <div className="nav-username flex items-center justify-between flex-1">
                  <span className="text-sm font-medium truncate">{userInfo.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {dropdownOpen && (
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
                  {userInfo.isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="nav-item-name">Dashboard</span>
                      </Link>
                      <Link to="/admin/productlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="nav-item-name">Products</span>
                      </Link>
                      <Link to="/admin/categorylist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="nav-item-name">Category</span>
                      </Link>
                      <Link to="/admin/orderlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="nav-item-name">Orders</span>
                      </Link>
                      <Link to="/admin/userlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="nav-item-name">Users</span>
                      </Link>
                      <div className="border-t border-gray-700 my-1" />
                    </>
                  )}
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="nav-item-name">Profile</span>
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors w-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="nav-item-name">Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass("/login")}>
                <AiOutlineLogin size={22} className="flex-shrink-0" />
                <span className="nav-item-name text-sm font-medium">Login</span>
              </Link>
              <Link to="/register" className={navLinkClass("/register")}>
                <AiOutlineUserAdd size={22} className="flex-shrink-0" />
                <span className="nav-item-name text-sm font-medium">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Navigation (< lg) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] text-white flex justify-around items-center py-2 z-[999] border-t border-gray-800">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${isActive("/") ? "text-pink-500" : "text-gray-400"}`}
        >
          <AiOutlineHome size={22} />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          to="/shop"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${isActive("/shop") ? "text-pink-500" : "text-gray-400"}`}
        >
          <AiOutlineShopping size={22} />
          <span className="text-[10px]">Shop</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg relative ${isActive("/cart") ? "text-pink-500" : "text-gray-400"}`}
        >
          <div className="relative">
            <AiOutlineShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </Link>

        <Link
          to="/favorite"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg relative ${isActive("/favorite") ? "text-pink-500" : "text-gray-400"}`}
        >
          <div className="relative">
            <FaHeart size={20} />
            {favoriteCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Saved</span>
        </Link>

        {userInfo ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-gray-400"
            >
              <FaUserCircle size={22} className="text-pink-400" />
              <span className="text-[10px] max-w-[44px] truncate">{userInfo.username}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-14 right-0 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl w-52 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700 mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold truncate">{userInfo.username}</p>
                </div>
                {userInfo.isAdmin && (
                  <>
                    <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Dashboard</Link>
                    <Link to="/admin/productlist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Products</Link>
                    <Link to="/admin/categorylist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Category</Link>
                    <Link to="/admin/orderlist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Orders</Link>
                    <Link to="/admin/userlist" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Users</Link>
                    <div className="border-t border-gray-700 my-1" />
                  </>
                )}
                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">Profile</Link>
                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-gray-400">
            <AiOutlineLogin size={22} />
            <span className="text-[10px]">Login</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navigation;