import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchMyItems,
    deleteItem,
    toggleItemActive,
} from "../../redux/features/items/itemsSlice";

const ManageItems = () => {
    const dispatch = useDispatch();
    const { myItems, myItemsStatus, myItemsError } = useSelector((s) => s.items);

    const [filter, setFilter] = useState("all"); // all, active, sold (inactive)

    useEffect(() => {
        dispatch(fetchMyItems({}));
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            dispatch(deleteItem(id));
        }
    };

    const handleToggleActive = (id, currentStatus) => {
        dispatch(toggleItemActive({ id, isActive: !currentStatus }));
    };

    const filteredItems = myItems.filter((item) => {
        if (filter === "all") return true;
        if (filter === "active") return item.isActive;
        if (filter === "sold") return !item.isActive;
        return true;
    });

    if (myItemsStatus === "loading") {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (myItemsStatus === "failed") {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                Error loading items: {myItemsError}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900">Manage Items</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        You have listed <b>{myItems.length}</b> items.
                    </p>
                </div>
                <Link
                    to="/profile/add-item"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm text-center"
                >
                    + List New Item
                </Link>
            </div>

            {/* Filters */}
            <div className="mt-6 flex gap-2 border-b border-slate-200 pb-1">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${filter === "all"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                >
                    All Items
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${filter === "active"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                >
                    Active
                </button>
                <button
                    onClick={() => setFilter("sold")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition ${filter === "sold"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        }`}
                >
                    Sold / Hidden
                </button>
            </div>

            {/* List */}
            <div className="mt-6 space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-slate-500">No items found.</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className={`p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 transition ${item.isActive ? "bg-white" : "bg-slate-50 opacity-75"
                                }`}
                        >
                            {/* Image */}
                            <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                                {item.imageUrls?.[0] ? (
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-bold text-slate-900 truncate pr-4">
                                        {item.title}
                                    </h3>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.isActive
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                : "bg-amber-50 text-amber-600 border-amber-200"
                                            }`}
                                    >
                                        {item.isActive ? "Active" : "Hidden"}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                                    {item.description || "No description"}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-sm">
                                    <span className="font-semibold text-slate-900">
                                        ₹
                                        {item.listingType === "sell"
                                            ? item.price
                                            : `${item.rentPrice}/${item.rentUnit}`}
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-slate-500 capitalize">{item.category}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="text-slate-500 capitalize">{item.listingType}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row sm:flex-col gap-2 justify-center sm:border-l sm:border-slate-100 sm:pl-4">
                                <Link
                                    to={`/edit-item/${item._id}`} // Assuming global edit page or separate one
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 text-center"
                                >
                                    ✏️ Edit
                                </Link>
                                <button
                                    onClick={() => handleToggleActive(item._id, item.isActive)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 whitespace-nowrap"
                                >
                                    {item.isActive ? "🚫 Mark Sold" : "✅ Mark Active"}
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="px-3 py-1.5 rounded-lg border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-50"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageItems;
