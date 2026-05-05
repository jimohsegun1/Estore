import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { HiUserCircle, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import ThemeToggle from "../../components/ThemeToggle";
import SearchBar from "../../components/SearchBar";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors w-full group ${
      isActive(path)
        ? "bg-indigo-500/10 text-indigo-600 dark:text-[#818cf8]"
        : "text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff]"
    }`;

  const mobileIconClass = (path) =>
    `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
      isActive(path)
        ? "text-indigo-500 dark:text-[#818cf8]"
        : "text-[#6b6b8a] dark:text-[#7777a0]"
    }`;

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div
        style={{ zIndex: 999 }}
        className="hidden lg:flex flex-col justify-between pt-5 pb-5 px-2.5 h-screen fixed top-0 left-0
          bg-white dark:bg-[#0f0f1c] border-r border-[#e4e4ef] dark:border-[#2a2a45]"
        id="navigation-container"
      >
        {/* Top section */}
        <div className="flex flex-col gap-0.5">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-3 py-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-brand-sm">
              E
            </div>
            <span className="nav-item-name font-bold text-base text-[#0f0f1a] dark:text-[#ededff]">Estore</span>
          </div>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors mb-1"
          >
            <HiMagnifyingGlass size={20} className="flex-shrink-0" />
            <span className="nav-item-name text-sm font-medium">Search</span>
          </button>

          <Link to="/" className={navLinkClass("/")}>
            <AiOutlineHome size={20} className="flex-shrink-0" />
            <span className="nav-item-name text-sm font-medium">Home</span>
          </Link>

          <Link to="/shop" className={navLinkClass("/shop")}>
            <AiOutlineShopping size={20} className="flex-shrink-0" />
            <span className="nav-item-name text-sm font-medium">Shop</span>
          </Link>

          <Link to="/cart" className={navLinkClass("/cart")}>
            <div className="relative flex-shrink-0">
              <AiOutlineShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="nav-item-name text-sm font-medium">Cart</span>
          </Link>

          <Link to="/favorite" className={navLinkClass("/favorite")}>
            <div className="relative flex-shrink-0">
              <FaHeart size={18} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </div>
            <span className="nav-item-name text-sm font-medium">Favorites</span>
          </Link>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-start px-3 py-1.5 mb-1">
            <ThemeToggle />
            <span className="nav-item-name text-sm font-medium text-[#6b6b8a] dark:text-[#7777a0] ml-2">Theme</span>
          </div>

          {userInfo ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors w-full"
              >
                <HiUserCircle size={20} className="flex-shrink-0 text-indigo-500 dark:text-[#818cf8]" />
                <div className="nav-username flex items-center justify-between flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{userInfo.username}</span>
                  <svg className={`h-3.5 w-3.5 ml-1 transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {dropdownOpen && (
                <div className="bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl overflow-hidden shadow-brand-md">
                  {userInfo.isAdmin && (
                    <>
                      {[
                        { to: "/admin/dashboard", label: "Dashboard" },
                        { to: "/admin/productlist", label: "Products" },
                        { to: "/admin/categorylist", label: "Category" },
                        { to: "/admin/orderlist", label: "Orders" },
                        { to: "/admin/userlist", label: "Users" },
                      ].map(({ to, label }) => (
                        <Link key={to} to={to} onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                          <span className="nav-item-name">{label}</span>
                        </Link>
                      ))}
                      <div className="border-t border-[#e4e4ef] dark:border-[#2a2a45] my-1" />
                    </>
                  )}
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="nav-item-name">Profile</span>
                  </Link>
                  <button onClick={logoutHandler}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="nav-item-name">Logout</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass("/login")}>
                <AiOutlineLogin size={20} className="flex-shrink-0" />
                <span className="nav-item-name text-sm font-medium">Login</span>
              </Link>
              <Link to="/register" className={navLinkClass("/register")}>
                <AiOutlineUserAdd size={20} className="flex-shrink-0" />
                <span className="nav-item-name text-sm font-medium">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f0f1c] border-t border-[#e4e4ef] dark:border-[#2a2a45] flex justify-around items-center py-2 z-[999]">
        <Link to="/" className={mobileIconClass("/")}>
          <AiOutlineHome size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link to="/shop" className={mobileIconClass("/shop")}>
          <AiOutlineShopping size={22} />
          <span className="text-[10px] font-medium">Shop</span>
        </Link>

        <button onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[#6b6b8a] dark:text-[#7777a0]">
          <HiMagnifyingGlass size={22} />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <Link to="/cart" className={`${mobileIconClass("/cart")} relative`}>
          <div className="relative">
            <AiOutlineShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>

        {userInfo ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[#6b6b8a] dark:text-[#7777a0]">
              <HiUserCircle size={22} className="text-indigo-500 dark:text-[#818cf8]" />
              <span className="text-[10px] font-medium max-w-[44px] truncate">{userInfo.username}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute bottom-14 right-0 bg-white dark:bg-[#0f0f1c] border border-[#e4e4ef] dark:border-[#2a2a45] rounded-2xl shadow-brand-lg w-52 py-2 z-50">
                <div className="px-4 py-2 border-b border-[#e4e4ef] dark:border-[#2a2a45] mb-1">
                  <p className="text-xs text-[#6b6b8a] dark:text-[#7777a0]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#0f0f1a] dark:text-[#ededff] truncate">{userInfo.username}</p>
                </div>
                {userInfo.isAdmin && (
                  <>
                    {[
                      { to: "/admin/dashboard", label: "Dashboard" },
                      { to: "/admin/productlist", label: "Products" },
                      { to: "/admin/categorylist", label: "Category" },
                      { to: "/admin/orderlist", label: "Orders" },
                      { to: "/admin/userlist", label: "Users" },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] hover:text-[#0f0f1a] dark:hover:text-[#ededff] transition-colors">
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-[#e4e4ef] dark:border-[#2a2a45] my-1" />
                  </>
                )}
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[#6b6b8a] dark:text-[#7777a0] hover:bg-[#f1f1f7] dark:hover:bg-[#17172a] transition-colors">
                  Profile
                </Link>
                <button onClick={logoutHandler}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/5 transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={mobileIconClass("/login")}>
            <AiOutlineLogin size={22} />
            <span className="text-[10px] font-medium">Login</span>
          </Link>
        )}
      </div>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <div className="w-full max-w-lg animate-slide-up">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
