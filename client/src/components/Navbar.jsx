import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Menu, X, ChevronDown, LogOut, User, PlusCircle, Search, Heart } from "lucide-react";

import { logout } from "../redux/features/auth/authSlice";
import { fetchColleges } from "../redux/features/colleges/collegesSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);
  const { list: colleges, status: collegeStatus } = useSelector((s) => s.colleges);

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    if (collegeStatus === "idle") dispatch(fetchColleges());
  }, [user, collegeStatus, dispatch]);

  const userCollege = useMemo(() => {
    if (!user?.currentCollege) return null;
    if (typeof user.currentCollege === "object") return user.currentCollege;
    return { _id: user.currentCollege };
  }, [user]);

  const resolvedCollege = useMemo(() => {
    if (!userCollege?._id) return null;
    const full = colleges?.find((c) => c._id === userCollege._id);
    return { ...full, ...userCollege };
  }, [userCollege, colleges]);

  const currentCollegeName =
    resolvedCollege?.shortName ||
    resolvedCollege?.name ||
    resolvedCollege?.code ||
    "Set College";

  const currentCollegeLogo = resolvedCollege?.logoUrl || null;

  const handleLogout = async () => {
    try {
      const res = await dispatch(logout());
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Logged out");
        setProfileOpen(false);
        setOpen(false);
        navigate("/", { replace: true });
      } else {
        toast.error(res.payload || "Logout failed");
      }
    } catch (e) {
      toast.error(e.message || "Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? "text-black" : "text-gray-500 hover:text-black"
    }`;

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Brand & College */}
          <div className="flex items-center gap-6">
            <Link to={user ? "/home" : "/"} className="flex-shrink-0">
              {/* Assuming storetypo.svg is the text logo, keeping it but ensuring size */}
              <img src="/storetypo.svg" alt="UniTrade" className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            </Link>

            {user && (
              <div className="hidden md:flex items-center h-6 w-px bg-gray-200 mx-2"></div>
            )}

            {user && (
              <button
                onClick={() => navigate("/profile")}
                className="hidden md:flex items-center gap-2 group pr-3 rounded-full"
              >
                <div className="w-15 h-15 overflow-hidden flex items-center justify-center">
                  {currentCollegeLogo ? (
                    <img src={currentCollegeLogo} alt="College" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] font-bold text-gray-500">UNI</span>
                  )}
                </div>
                <span className="text-md font-medium text-gray-600 group-hover:text-black transition-colors max-w-[120px] truncate">
                  {currentCollegeName}
                </span>
              </button>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/home" className={navLinkClass}>Feed</NavLink>
            <NavLink to="/products" className={navLinkClass}>Browse</NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>

            {user && (
              <NavLink to="/add-item" className={navLinkClass}>Sell</NavLink>
            )}

            {/* Search Trigger (Mock) */}
            <button className="text-gray-400 hover:text-black transition">
              <Search size={18} />
            </button>

            {/* Profile Dropdown */}
            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition">Log in</Link>
                <Link to="/signup" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition shadow-lg shadow-gray-200">Sign Up</Link>
              </div>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
                        {user?.name?.[0] || "U"}
                      </div>
                    )}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-xs font-medium text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/add-item" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <PlusCircle size={16} /> Sell Item
                      </Link>
                      <Link to="/home/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <Heart size={16} /> Wishlist
                      </Link>
                    </div>

                    <div className="py-1 border-t border-gray-50">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-black">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-16 duration-200 ease-in-out">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <NavLink to="/home" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Feed</NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Browse</NavLink>
            {user && (
              <>
                <NavLink to="/add-item" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Sell Item</NavLink>
                <NavLink to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Profile</NavLink>
                <div className="border-t border-gray-100 my-2"></div>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
              </>
            )}
            {!user && (
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/login" className="w-full text-center py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">Log In</Link>
                <Link to="/signup" className="w-full text-center py-2.5 rounded-lg bg-black text-white text-sm font-semibold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
