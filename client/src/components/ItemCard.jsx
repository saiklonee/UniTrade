import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../redux/features/wishlist/wishlistSlice";

const CURRENCY = import.meta.env.VITE_CURRENCY || "₹";

const ItemCard = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((s) => s.auth);
    const { items: wishlistItems, updatingId } = useSelector((s) => s.wishlist);

    if (!item) return null;

    const {
        _id,
        title,
        imageUrls = [],
        listingType,
        price,
        rentPrice,
        rentUnit,
        condition,
        category,
    } = item;

    const displayPrice =
        listingType === "sell"
            ? `${CURRENCY} ${price}`
            : `${CURRENCY} ${rentPrice} / ${rentUnit}`;

    // build wishlist id set safely
    const wishlistIdSet = useMemo(() => {
        const arr = Array.isArray(wishlistItems)
            ? wishlistItems
            : Array.isArray(wishlistItems?.wishlist)
                ? wishlistItems.wishlist
                : Array.isArray(wishlistItems?.items)
                    ? wishlistItems.items
                    : [];

        // supports [{item:{_id}}] or [{_id}]
        const ids = arr.map((x) => x?.item?._id || x?._id).filter(Boolean);
        return new Set(ids);
    }, [wishlistItems]);

    const isInWishlist = wishlistIdSet.has(_id);
    const isUpdating = updatingId === _id;

    const toggleWishlist = async (e) => {
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to use wishlist");
            navigate("/login");
            return;
        }

        const action = isInWishlist ? removeFromWishlist(_id) : addToWishlist(_id);
        const res = await dispatch(action);

        if (res.meta.requestStatus === "fulfilled") {
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
            dispatch(fetchWishlist()); // simple & consistent
        } else {
            toast.error(res.payload || "Wishlist action failed");
        }
    };

    return (
        <div
            onClick={() => navigate(`/item/${_id}`)}
            className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
            {/* Image */}
            <div className="relative h-44 bg-slate-100">
                {imageUrls?.[0] ? (
                    <img
                        src={imageUrls[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No Image
                    </div>
                )}

                {/* Wishlist */}
                <button
                    onClick={toggleWishlist}
                    disabled={isUpdating}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full shadow hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={16}
                        className={isInWishlist ? "text-red-500 fill-red-500" : "text-slate-600"}
                    />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-slate-900 truncate">{title}</h3>

                <div className="flex items-center justify-between">
                    <span className="text-indigo-600 font-bold text-sm">{displayPrice}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {listingType}
                    </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{condition}</span>
                    <span className="capitalize">{category}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
