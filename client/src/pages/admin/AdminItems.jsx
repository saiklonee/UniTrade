import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { http } from "../../api/http";

const FALLBACK_AVATAR =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <rect width="100%" height="100%" rx="14" ry="14" fill="#111827"/>
    <circle cx="32" cy="26" r="10" fill="#374151"/>
    <path d="M14 54c3.5-10 32.5-10 36 0" fill="#374151"/>
  </svg>
`);

const AdminItems = () => {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");

    const [q, setQ] = useState("");
    const [type, setType] = useState("all"); // all | sell | rent
    const [status, setStatus] = useState("all"); // all | active | inactive

    const getPoster = (it) => {
        // ✅ match your ItemCard reference
        const poster =
            it?.user ||
            it?.owner ||
            it?.seller ||
            it?.userId ||
            it?.createdBy ||
            null;

        const posterName =
            poster?.username ||
            poster?.name ||
            poster?.fullName ||
            (typeof poster === "string" ? poster : "") ||
            "Unknown";

        const posterAvatar =
            poster?.avatarUrl ||
            poster?.avatar ||
            poster?.profilePic ||
            poster?.photoUrl ||
            FALLBACK_AVATAR;

        return { poster, posterName, posterAvatar };
    };

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();

        return rows.filter((it) => {
            const { posterName } = getPoster(it);

            const matchesQ =
                !qq ||
                it?.title?.toLowerCase()?.includes(qq) ||
                it?.category?.toLowerCase()?.includes(qq) ||
                it?.condition?.toLowerCase()?.includes(qq) ||
                String(posterName || "").toLowerCase().includes(qq);

            const matchesType = type === "all" || it?.listingType === type;

            const isActive = it?.isActive !== false;
            const matchesStatus = status === "all" || (status === "active" ? isActive : !isActive);

            return matchesQ && matchesType && matchesStatus;
        });
    }, [rows, q, type, status]);

    const load = async () => {
        try {
            setLoading(true);
            setError("");

            // Using your current route
            const res = await http.get("/api/item/list");
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to load items");

            // normalize possible shapes
            const items =
                res.data.items ||
                res.data.data ||
                res.data.payload ||
                res.data?.list ||
                [];

            setRows(Array.isArray(items) ? items : []);
        } catch (e) {
            setError(e.message || "Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const toggleActive = async (itemId, nextActive) => {
        try {
            // ⚠️ Your backend currently has this:
            // PATCH /api/item/toggle-active/:id  (auth)
            // Your code is calling /api/item/admin/toggle-active/:id which won't exist unless you added it.
            // So use your existing route for now:
            const res = await http.patch(`/api/item/toggle-active/${itemId}`, { isActive: nextActive });

            if (!res.data?.success) throw new Error(res.data?.message || "Action failed");

            toast.success(nextActive ? "Item activated" : "Item deactivated");
            setRows((prev) => prev.map((it) => (it._id === itemId ? { ...it, isActive: nextActive } : it)));
        } catch (e) {
            toast.error(e.message || "Action failed");
        }
    };

    const deleteItem = async (itemId) => {
        const ok = window.confirm("Delete this item permanently? This cannot be undone.");
        if (!ok) return;

        try {
            // ⚠️ Your backend currently has:
            // DELETE /api/item/remove/:id
            const res = await http.delete(`/api/item/remove/${itemId}`);

            if (!res.data?.success) throw new Error(res.data?.message || "Delete failed");

            toast.success("Item deleted");
            setRows((prev) => prev.filter((it) => it._id !== itemId));
        } catch (e) {
            toast.error(e.message || "Delete failed");
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900">Items</h1>
                    <p className="text-sm text-slate-500 mt-1">Moderate listings.</p>
                </div>

                <button
                    onClick={load}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                >
                    Refresh
                </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search title / category / posted by..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                    <option value="all">All types</option>
                    <option value="sell">Sell</option>
                    <option value="rent">Rent</option>
                </select>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                    <option value="all">All status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-6 text-sm text-slate-500">Loading items...</div>
            ) : (
                <div className="mt-6 overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Posted By</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {filtered.map((it) => {
                                const thumb = it?.imageUrls?.[0];
                                const isActive = it?.isActive !== false;

                                const { posterName, posterAvatar } = getPoster(it);

                                const priceText =
                                    it?.listingType === "rent"
                                        ? `₹ ${Number(it?.rentPrice || 0).toLocaleString()} / ${it?.rentUnit || ""}`
                                        : `₹ ${Number(it?.price || 0).toLocaleString()}`;

                                return (
                                    <tr key={it._id} className="text-sm">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                                    {thumb ? (
                                                        <img src={thumb} alt={it?.title} className="w-full h-full object-cover" />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900 truncate max-w-[280px]">
                                                        {it?.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize">
                                                        {it?.category} • {it?.condition}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 capitalize">{it?.listingType}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{priceText}</td>

                                        {/* ✅ Posted By (fixed like your ItemCard logic) */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <img
                                                    src={posterAvatar}
                                                    alt={posterName}
                                                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                                                    onError={(e) => {
                                                        e.currentTarget.src = FALLBACK_AVATAR;
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-slate-500 leading-none">Posted by</p>
                                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                                        {posterName || "Unknown"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${isActive
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                        : "bg-red-50 border-red-200 text-red-700"
                                                    }`}
                                            >
                                                {isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleActive(it._id, !isActive)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isActive
                                                            ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                                        }`}
                                                >
                                                    {isActive ? "Deactivate" : "Activate"}
                                                </button>

                                                <button
                                                    onClick={() => deleteItem(it._id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                                        No items found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminItems;
