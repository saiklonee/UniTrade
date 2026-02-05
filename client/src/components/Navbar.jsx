import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setProfileOpen(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white sticky top-0 border-b border-gray-200 px-6 md:px-16 lg:px-24 xl:px-32 py-4 shadow-sm  z-50">
      {/* Navbar container */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            src="/storetypo.svg"
            alt="logo"
            className="cursor-pointer w-34 md:w-38"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/seller" className="hover:text-primary transition">
            Seller
          </NavLink>
          <NavLink to="/products" className="hover:text-primary transition">
            All Products
          </NavLink>
          <NavLink to="/contact" className="hover:text-primary transition">
            Contact
          </NavLink>

          {/* Search bar */}
          <div className="hidden lg:flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none placeholder-gray-500 w-40"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="Search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <img
              src={assets.nav_cart_icon}
              alt="Cart"
              className="w-5 opacity-70"
            />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          {/* Profile / Login */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full transition text-sm cursor-pointer "
            >
              Login
            </button>
          ) : (
            <div ref={profileRef} className="relative">
              <img
                src={assets.profile_icon}
                className="w-10 cursor-pointer"
                alt="Profile"
                onClick={() => setProfileOpen((prev) => !prev)}
              />
              {profileOpen && (
                <ul className="absolute top-12 right-0 bg-white border rounded-md shadow-md py-2 w-40 text-sm z-50">
                  <li className="px-4 py-2 hover:bg-gray-100">{user.name}</li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/profile" onClick={() => setProfileOpen(false)}>profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/my-orders" onClick={() => setProfileOpen(false)}>
                      My Orders
                    </Link>
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <img
              src={assets.nav_cart_icon}
              alt="Cart"
              className="w-5 opacity-70"
            />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-primary w-5 h-5 rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <img src={assets.menu_icon} alt="Menu" className="w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-2 bg-white border-t pt-4 pb-6 px-4 flex flex-col gap-3 text-sm shadow-md rounded-b-lg">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
