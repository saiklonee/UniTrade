import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { logout } from "../redux/features/auth/authSlice";
import { fetchColleges } from "../redux/features/colleges/collegesSlice"; // ✅ make sure this exists

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);
  const { list: colleges, status: collegeStatus } = useSelector((s) => s.colleges);

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // ✅ Fetch colleges once (needed to get logoUrl by id)
  useEffect(() => {
    if (!user) return;
    if (collegeStatus === "idle") dispatch(fetchColleges());
  }, [user, collegeStatus, dispatch]);

  // Current college from user can be object (minimal) OR string id
  const userCollege = useMemo(() => {
    if (!user?.currentCollege) return null;
    if (typeof user.currentCollege === "object") return user.currentCollege; // { _id, code, name }
    // if it's just id string, keep it as object-like
    return { _id: user.currentCollege };
  }, [user]);

  // ✅ resolve full college from colleges list (for logoUrl, shortName, etc.)
  const resolvedCollege = useMemo(() => {
    if (!userCollege?._id) return null;
    const full = colleges?.find((c) => c._id === userCollege._id);
    // Merge: userCollege has guaranteed name/code; full adds logoUrl/shortName/etc.
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

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `hover:text-indigo-600 transition ${isActive ? "text-indigo-600 font-semibold" : "text-slate-700"
    }`;

  return (
    <nav className="bg-white sticky top-0 border-b border-gray-200 px-5 md:px-10 lg:px-16 py-4 shadow-sm z-50">
      <div className="flex justify-between items-center">
        {/* Left: Brand + Current College */}
        <div className="flex items-center gap-3">
          <Link to={user ? "/home" : "/"} className="flex items-center">
            <img
              src="/storetypo.svg"
              alt="UniTrade"
              className="cursor-pointer w-28 md:w-32"
            />
          </Link>

          {/* Divider */}
          <span className="text-gray-300 select-none">|</span>

          {/* Current College badge (logo + name) */}
          <button
            type="button"
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white transition"
            title={user ? "Change current college in Profile" : "Login to set college"}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {currentCollegeLogo ? (
                <img
                  src={currentCollegeLogo}
                  alt={currentCollegeName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[10px] text-gray-500 font-semibold">
                  {currentCollegeName?.slice(0, 3)?.toUpperCase() || "UNI"}
                </span>
              )}
            </div>

            <span className="text-sm font-medium text-slate-700 max-w-[180px] truncate">
              {currentCollegeName}
            </span>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to={user ? "/home" : "/"} className={linkClass}>
            Feed
          </NavLink>

          {user && (
            <NavLink to="/add-item" className={linkClass}>
              Add Item
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/college" className={linkClass}>
              Colleges (Admin)
            </NavLink>
          )}

          {/* Profile / Login */}
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition text-sm font-semibold"
            >
              Login
            </button>
          ) : (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white transition"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user?.name || user?.username || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-600">
                      {(user?.name || user?.username || "U")
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                  {user?.name || user?.username}
                </span>
              </button>

              {profileOpen && (
                <ul className="absolute top-12 right-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-56 text-sm z-50 overflow-hidden">
                  <li className="px-4 py-2 text-slate-500">
                    <div className="text-xs">Logged in as</div>
                    <div className="font-semibold text-slate-800 truncate">
                      {user?.email}
                    </div>
                  </li>
                  <div className="h-px bg-gray-100 my-1" />

                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Profile / College
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/home");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Feed
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/add-item");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Add Item
                    </button>
                  </li>

                  {user?.role === "admin" && (
                    <li>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/college");
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        Colleges (Admin)
                      </button>
                    </li>
                  )}

                  <div className="h-px bg-gray-100 my-1" />
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition text-sm font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => setOpen((v) => !v)}
              className="px-3 py-2 border border-gray-200 rounded-xl"
              aria-label="Toggle menu"
            >
              <span className="text-sm font-semibold text-slate-800">Menu</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-3 bg-white border border-gray-200 pt-3 pb-4 px-4 flex flex-col gap-2 text-sm shadow-md rounded-2xl">
          <NavLink
            to={user ? "/home" : "/"}
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Feed
          </NavLink>

          {user && (
            <NavLink
              to="/add-item"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Add Item
            </NavLink>
          )}

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Profile / College
          </NavLink>

          {user?.role === "admin" && (
            <NavLink
              to="/college"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Colleges (Admin)
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
