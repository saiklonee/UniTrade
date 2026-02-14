import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { FiGrid, FiUsers, FiPackage, FiUser, FiArrowLeft, FiHome } from "react-icons/fi";

const AdminDashboardLayout = () => {
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
            <div className="max-w-full h-full mx-auto px-4 md:px-6 py-6">
                <div className="grid h-full grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                    {/* Sidebar */}
                    <aside className="bg-white h-full border border-slate-200 rounded-2xl shadow-sm p-4">
                        {/* Admin card */}
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
                                    {user?.name || user?.username || "Admin"}
                                </div>
                                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                    College: <span className="font-semibold">{currentCollegeName}</span>
                                </div>
                                <div className="mt-2 inline-flex rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 text-[11px] font-semibold">
                                    Admin Access
                                </div>
                            </div>
                        </div>

                        {/* Admin Nav */}
                        <div className="mt-4 grid gap-2">
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                <FiGrid className="text-base" />
                                Overview
                            </NavLink>

                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                <FiUsers className="text-base" />
                                Users
                            </NavLink>

                            <NavLink
                                to="/admin/items"
                                className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                            >
                                <FiPackage className="text-base" />
                                Items
                            </NavLink>

                            <div className="pt-3 mt-3 border-t border-slate-200">
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
                                >
                                    <FiUser className="text-base" />
                                    My Profile
                                </NavLink>
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                            <button
                                onClick={() => navigate("/home")}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                            >
                                <FiArrowLeft className="text-base" />
                                Back to Feed
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                            >
                                <FiHome className="text-base" />
                                Home
                            </button>
                        </div>
                    </aside>

                    {/* Outlet */}
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6 min-h-[500px] overflow-auto">
                        <Outlet />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
