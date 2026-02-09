import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemById } from "../redux/features/items/itemsSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../redux/features/wishlist/wishlistSlice";
import { Heart, Share2, MessageCircle, ArrowLeft, MapPin, Tag, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const CURRENCY = import.meta.env.VITE_CURRENCY || "₹";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { itemById, itemStatus, itemError } = useSelector((s) => s.items);
    const { user } = useSelector((s) => s.auth);
    const { items: wishlistItems } = useSelector((s) => s.wishlist);

    const [activeImage, setActiveImage] = useState(0);

    const item = itemById?.[id];

    useEffect(() => {
        if (id) {
            dispatch(fetchItemById(id));
        }
    }, [id, dispatch]);

    const isInWishlist = React.useMemo(() => {
        if (!wishlistItems) return false;
        const list = Array.isArray(wishlistItems) ? wishlistItems : (wishlistItems.items || wishlistItems.wishlist || []);
        return list.some(x => (x.item?._id === id) || (x._id === id));
    }, [wishlistItems, id]);

    const handleWishlist = async () => {
        if (!user) return navigate("/login");
        const action = isInWishlist ? removeFromWishlist(id) : addToWishlist(id);
        const res = await dispatch(action);
        if (res.meta.requestStatus === "fulfilled") {
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
            dispatch(fetchWishlist());
        }
    };

    if (itemStatus === "loading" || !item) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (itemStatus === "failed") {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate("/home")} className="px-6 py-2 bg-black text-white rounded-full">Go Home</button>
            </div>
        );
    }

    const { title, description, price, rentPrice, rentUnit, listingType, imageUrls, category, condition, status, seller } = item;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 relative group">
                            {imageUrls?.[activeImage] ? (
                                <img
                                    src={imageUrls[activeImage]}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                            {status !== 'available' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-white px-4 py-2 rounded-full font-bold uppercase tracking-wider">{status}</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {imageUrls?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {imageUrls.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">{category}</span>
                                <div className="flex gap-2">
                                    <button onClick={handleWishlist} className={`p-2 rounded-full border transition-colors ${isInWishlist ? 'border-red-100 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'}`}>
                                        <Heart size={20} className={isInWishlist ? "fill-current" : ""} />
                                    </button>
                                    <button className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    {listingType === 'sell'
                                        ? `${CURRENCY} ${price?.toLocaleString()}`
                                        : `${CURRENCY} ${rentPrice?.toLocaleString()} / ${rentUnit}`
                                    }
                                </span>
                                {listingType === 'rent' && <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider text-gray-600">Rent</span>}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Tag size={16} />
                                    <span className="capitalize">{condition} Condition</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck size={16} />
                                    <span>Verified Seller</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{description}</p>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                                    {seller?.avatarUrl ? <img src={seller.avatarUrl} alt="" className="w-full h-full object-cover" /> : (seller?.name?.[0] || "U")}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{seller?.name || "Unknown Seller"}</p>
                                    <p className="text-xs text-gray-500">Member since {new Date(seller?.createdAt || Date.now()).getFullYear()}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline">
                                View Profile
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto flex gap-4">
                            <button className="flex-1 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 active:scale-95">
                                {listingType === 'rent' ? 'Request to Rent' : 'Buy Now'}
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-900 px-6 py-4 rounded-full font-semibold hover:border-black transition-colors flex items-center justify-center gap-2">
                                <MessageCircle size={20} />
                                Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
