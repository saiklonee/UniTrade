import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { http } from "../api/http";

const CATEGORIES = [
    { value: "books", label: "Books" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
    { value: "notes", label: "Notes" },
    { value: "sports", label: "Sports Equipment" },
    { value: "cycles", label: "Cycles/Bikes" },
    { value: "stationery", label: "Stationery" },
    { value: "hostel", label: "Hostel Items" },
    { value: "other", label: "Other" },
];

const CONDITIONS = [
    { value: "new", label: "Brand New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
];

const LISTING_TYPES = [
    { value: "sell", label: "Sell" },
    { value: "rent", label: "Rent" },
];

const RENT_UNITS = [
    { value: "day", label: "Per Day" },
    { value: "week", label: "Per Week" },
    { value: "month", label: "Per Month" },
];

const AddItem = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // User state
    const [user, setUser] = useState(null);
    const [userCollege, setUserCollege] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "other",
        condition: "good",
        listingType: "sell",
        price: "",
        rentPrice: "",
        rentUnit: "day",
        securityDeposit: "0",
        tags: "",
    });

    // Image state
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Check authentication and get user data
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setAuthLoading(true);
                setError("");

                // ✅ using http (withCredentials already)
                const response = await http.get("/api/user/is-auth");

                if (response.data?.success && response.data?.user) {
                    setUser(response.data.user);

                    if (response.data.user.currentCollege) {
                        setUserCollege(response.data.user.currentCollege);
                    }

                    localStorage.setItem("user", JSON.stringify(response.data.user));
                } else {
                    throw new Error("Not authenticated");
                }
            } catch (err) {
                console.error("Auth error:", err);
                localStorage.removeItem("user");
                navigate("/login");
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 5) {
            setError("Maximum 5 images allowed");
            e.target.value = "";
            return;
        }

        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

        const validFiles = [];

        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                setError(`Invalid file type: ${file.name}. Only images are allowed.`);
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(`File too large: ${file.name}. Maximum size is 5MB.`);
                return;
            }

            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });

        if (validFiles.length > 0) {
            setImages((prev) => [...prev, ...validFiles]);
            setError("");
        }

        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Title is required");
            return false;
        }

        if (formData.listingType === "sell" && !formData.price) {
            setError("Price is required for sell items");
            return false;
        }

        if (formData.listingType === "rent") {
            if (!formData.rentPrice) {
                setError("Rent price is required for rent items");
                return false;
            }
            if (!formData.rentUnit) {
                setError("Rent unit is required for rent items");
                return false;
            }
        }

        if (images.length === 0) {
            setError("At least one image is required");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        if (!userCollege) {
            setError("You need to select a college in your profile first");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("title", formData.title.trim());
            data.append("description", formData.description.trim());
            data.append("category", formData.category);
            data.append("condition", formData.condition);
            data.append("listingType", formData.listingType);

            if (formData.listingType === "sell") {
                data.append("price", formData.price);
            } else {
                data.append("rentPrice", formData.rentPrice);
                data.append("rentUnit", formData.rentUnit);
                data.append("securityDeposit", formData.securityDeposit || "0");
            }

            if (formData.tags.trim()) {
                data.append("tags", formData.tags.trim());
            }

            images.forEach((img) => data.append("images", img));

            // ✅ using http
            const response = await http.post("/api/item/add", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data?.success) {
                setSuccess("Item listed successfully!");

                setFormData({
                    title: "",
                    description: "",
                    category: "other",
                    condition: "good",
                    listingType: "sell",
                    price: "",
                    rentPrice: "",
                    rentUnit: "day",
                    securityDeposit: "0",
                    tags: "",
                });
                setImages([]);
                setImagePreviews([]);

                setTimeout(() => {
                    // NOTE: you used /item/:id earlier; your ItemCard uses /product/:id
                    // keep this consistent with your app routes:
                    navigate(`/item/${response.data.item._id}`);
                }, 1200);
            } else {
                setError(response.data?.message || "Failed to list item");
            }
        } catch (err) {
            console.error("Error listing item:", err);
            console.error("Full error response:", err.response?.data);

            if (err.response?.status === 400) {
                const msg = err.response?.data?.message;
                setError(msg ? `Validation Error: ${msg}` : "Bad request. Please check required fields.");
            } else if (err.response?.status === 401) {
                setError("Session expired. Please login again.");
                setTimeout(() => navigate("/login"), 1200);
            } else if (err.code === "ERR_NETWORK") {
                setError("Cannot connect to server. Make sure backend is running.");
            } else {
                setError(err.response?.data?.message || err.message || "Failed to list item. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Loading while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (!userCollege) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                        <h2 className="text-lg font-semibold mb-2">College Not Set</h2>
                        <p className="text-slate-300 mb-4">
                            You need to select a college in your profile before listing items.
                        </p>
                        <button
                            onClick={() => navigate("/profile")}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
                        >
                            Go to Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">List an Item</h1>
                    <p className="text-slate-400 mt-2">
                        Fill in the details below to list your item for sale or rent
                    </p>
                </div>

                {/* Error/Success */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <p className="text-green-200">{success}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Physics Textbook, Gaming Laptop"
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    required
                                    maxLength="80"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your item in detail..."
                                    rows="4"
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    maxLength="2000"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Condition *
                                    </label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                    >
                                        {CONDITIONS.map((cond) => (
                                            <option key={cond.value} value={cond.value}>
                                                {cond.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g., textbook, physics, semester-3"
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Listing Details */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-semibold mb-4">Listing Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Listing Type *
                                </label>
                                <div className="flex gap-2">
                                    {LISTING_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    listingType: type.value,
                                                    price: type.value === "sell" ? prev.price : "",
                                                    rentPrice: type.value === "rent" ? prev.rentPrice : "",
                                                    rentUnit: type.value === "rent" ? prev.rentUnit : "day",
                                                    securityDeposit: type.value === "rent" ? prev.securityDeposit : "0",
                                                }))
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${formData.listingType === type.value
                                                    ? "bg-indigo-500 text-white"
                                                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.listingType === "sell" ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Price (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.01"
                                        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Rent Price (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                name="rentPrice"
                                                value={formData.rentPrice}
                                                onChange={handleInputChange}
                                                placeholder="Enter rent price"
                                                min="0"
                                                step="0.01"
                                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Rent Unit *
                                            </label>
                                            <select
                                                name="rentUnit"
                                                value={formData.rentUnit}
                                                onChange={handleInputChange}
                                                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                                required
                                            >
                                                {RENT_UNITS.map((unit) => (
                                                    <option key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Security Deposit (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="securityDeposit"
                                            value={formData.securityDeposit}
                                            onChange={handleInputChange}
                                            placeholder="Optional security deposit"
                                            min="0"
                                            step="0.01"
                                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h2 className="text-lg font-semibold mb-4">Images *</h2>
                        <p className="text-sm text-slate-400 mb-4">
                            Upload up to 5 images. First image will be the thumbnail.
                        </p>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center ${images.length >= 5
                                    ? "opacity-50 cursor-not-allowed"
                                    : "border-white/20 hover:border-indigo-500/50"
                                }`}
                        >
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={images.length >= 5}
                                className="hidden"
                            />
                            <label htmlFor="images" className={`${images.length >= 5 ? "cursor-not-allowed" : "cursor-pointer"}`}>
                                <div className="space-y-2">
                                    <div className="text-4xl">📷</div>
                                    <p className="text-slate-300">
                                        {images.length >= 5 ? "Maximum 5 images reached" : "Click to upload images"}
                                    </p>
                                    <p className="text-sm text-slate-400">PNG, JPG, GIF, WebP up to 5MB each</p>
                                    <p className="text-sm text-slate-400">{images.length}/5 images selected</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="sticky bottom-6 bg-slate-950/80 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center gap-4">
                            <div className="min-w-0">
                                <p className="text-sm text-slate-400 truncate">
                                    Listing in:{" "}
                                    <span className="text-white">{userCollege?.name || "Your College"}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    Logged in as: {user?.name || user?.username}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                            >
                                {loading ? "Listing Item..." : "List Item"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
