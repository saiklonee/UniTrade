import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchWishlist } from "../redux/features/wishlist/wishlistSlice";
import ItemCard from "../components/ItemCard";

const Wishlist = () => {
    const dispatch = useDispatch();

    const { items, status, error } = useSelector((s) => s.wishlist);
    const { user } = useSelector((s) => s.auth);

    const normalizedItems = useMemo(() => {
        const arr = Array.isArray(items)
            ? items
            : Array.isArray(items?.wishlist)
                ? items.wishlist
                : Array.isArray(items?.items)
                    ? items.items
                    : [];

        return arr.map((x) => x?.item || x).filter(Boolean);
    }, [items]);

    useEffect(() => {
        if (!user) return;
        dispatch(fetchWishlist());
    }, [dispatch, user]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    if (!user) {
        return (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                <h2 className="text-lg font-bold text-slate-900">Wishlist</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Please login to see your wishlist.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900">Wishlist</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Items you saved.
                    </p>
                </div>

                <button
                    onClick={() => dispatch(fetchWishlist())}
                    disabled={status === "loading"}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === "loading" ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Body */}
            {status === "loading" ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
                    Loading wishlist…
                </div>
            ) : normalizedItems.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-slate-800 font-semibold">No items in wishlist</div>
                    <div className="text-slate-500 text-sm mt-1">
                        Browse your university feed and add items to wishlist.
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-sm text-slate-500">
                        Total:{" "}
                        <span className="font-semibold text-slate-800">
                            {normalizedItems.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {normalizedItems.map((item) => (
                            <ItemCard key={item._id} item={item} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Wishlist;
