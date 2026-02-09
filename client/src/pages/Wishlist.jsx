import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchWishlist } from "../redux/features/wishlist/wishlistSlice";
import ItemCard from "../components/ItemCard";
import { Heart } from "lucide-react";

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

        // Filter out nulls and ensure structure
        return arr.map((x) => x?.item || x).filter(i => i && i._id);
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
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <Heart size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">Wishlist</h2>
                <p className="text-gray-500 mt-2">Please login to see your wishlist.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
                    <p className="text-gray-500 mt-1">{normalizedItems.length} items saved</p>
                </div>
            </div>

            {status === "loading" && normalizedItems.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : normalizedItems.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Your wishlist is empty</h3>
                    <p className="text-gray-500 mt-2">Browse the feed and save items you like!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                    {normalizedItems.map((item) => (
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
