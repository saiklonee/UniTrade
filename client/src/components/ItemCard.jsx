import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    addToWishlist,
    fetchWishlist,
    removeFromWishlist,
} from "../redux/features/wishlist/wishlistSlice";

const CURRENCY = import.meta.env.VITE_CURRENCY || "₹";

// Fallback avatar (optional)
const FALLBACK_AVATAR =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
    <rect width="100%" height="100%" rx="14" ry="14" fill="#111827"/>
    <circle cx="32" cy="26" r="10" fill="#374151"/>
    <path d="M14 54c3.5-10 32.5-10 36 0" fill="#374151"/>
  </svg>
`);

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
        // possible poster fields (may or may not exist)
        user: itemUser,
        owner,
        seller,
        userId,
        createdBy,
    } = item;

    // ✅ detect poster object from multiple possible keys
    const poster =
        itemUser ||
        owner ||
        seller ||
        userId ||
        createdBy ||
        null;

    const posterName =
        poster?.username ||
        poster?.name ||
        poster?.fullName ||
        "Unknown";

    const posterAvatar =
        poster?.avatarUrl ||
        poster?.avatar ||
        poster?.profilePic ||
        poster?.photoUrl ||
        FALLBACK_AVATAR;

    const displayPrice =
        listingType === "sell"
            ? `${CURRENCY} ${price?.toLocaleString?.() ?? price ?? ""}`
            : `${CURRENCY} ${rentPrice?.toLocaleString?.() ?? rentPrice ?? ""} / ${rentUnit ?? ""}`;

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
            dispatch(fetchWishlist());
        } else {
            toast.error(res.payload || "Wishlist action failed");
        }
    };

    return (
        <div
            onClick={() => navigate(`/product/${_id}`)}
            className="group cursor-pointer flex flex-col gap-3"
        >
            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                {imageUrls?.[0] ? (
                    <img
                        src={imageUrls[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-sm">
                        No Image
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    disabled={isUpdating}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isInWishlist
                            ? "bg-white/90 text-red-500 shadow-sm"
                            : "bg-black/10 text-white opacity-0 group-hover:opacity-100 hover:bg-black/30"
                        } ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={18}
                        className={isInWishlist ? "fill-current" : ""}
                        strokeWidth={isInWishlist ? 0 : 2}
                    />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {listingType === "rent" && (
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-black rounded-full shadow-sm">
                            Rent
                        </span>
                    )}
                    {!!condition && (
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-black rounded-full shadow-sm">
                            {condition}
                        </span>
                    )}
                </div>

                {/* ✅ Poster strip (bottom overlay) */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="flex items-center gap-2 rounded-xl bg-black/35 backdrop-blur-md border border-white/10 px-3 py-2">
                        <img
                            src={posterAvatar}
                            alt={posterName}
                            className="h-7 w-7 rounded-full object-cover border border-white/20"
                            onError={(e) => {
                                e.currentTarget.src = FALLBACK_AVATAR;
                            }}
                        />
                        <div className="min-w-0">
                            <p className="text-[11px] text-white/70 leading-none">Posted by</p>
                            <p className="text-sm text-white font-medium leading-tight truncate">
                                @{String(posterName).replace(/\s+/g, "").toLowerCase() || "user"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-1">
                <div className="flex justify-between items-start gap-3">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {title}
                    </h3>
                    <p className="font-semibold text-gray-900 whitespace-nowrap text-sm">
                        {displayPrice}
                    </p>
                </div>
                <p className="text-sm text-gray-500 capitalize">{category}</p>
            </div>
        </div>
    );
};

export default ItemCard;
