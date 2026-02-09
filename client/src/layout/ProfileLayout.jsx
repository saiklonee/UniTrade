import React, { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileLayout = () => {
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);

    const currentCollegeName = useMemo(() => {
        const c = user?.currentCollege;
        if (!c) return "Not set";
        if (typeof c === "object") return c.shortName || c.name || c.code || "Not set";
        return "Not set";
    }, [user]);

    const linkBase =
        "flex items-center gap-3 px-3 py-2 rounded-xl transition text-sm font-medium";
    const active = "bg-indigo-600 text-white shadow-sm";
    const idle = "text-slate-700 hover:bg-slate-100";

    return (
        <div className="h-screen w-full bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* Sidebar */}
                    <aside className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 h-fit sticky top-24">
                        {/* User card */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user?.name || user?.username || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-extrabold text-slate-600">
                                        {(user?.name || user?.username || "U").slice(0, 1).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                    {user?.name || user?.username || "User"}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    College: <span className="font-semibold">{currentCollegeName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Nav */}
                        <div className="mt-4 grid gap-2">
                            <NavLink
                                to="/profile"
                                end
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                ✏️ Edit Profile
                            </NavLink>

                            <NavLink
                                to="/profile/add-item"
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                ➕ Add Item
                            </NavLink>

                            <NavLink
                                to="/profile/manage-items"
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                📦 Manage Items
                            </NavLink>

                            <NavLink
                                to="/home/wishlist"
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                ❤️ Wishlist
                            </NavLink>

                            {/* Optional: Danger Zone */}
                            {/* <div className="pt-2 mt-2 border-t border-slate-100">
                                <button className="flex items-center gap-3 px-3 py-2 rounded-xl transition text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">
                                    🚪 Logout
                                </button>
                            </div> */}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                            <button
                                onClick={() => navigate("/home")}
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                            >
                                Back to Feed
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                            >
                                Home
                            </button>
                        </div>
                    </aside>

                    {/* Outlet */}
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6 min-h-[500px]">
                        <Outlet />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
