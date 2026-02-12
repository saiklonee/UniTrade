import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { http } from "../../api/http";

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

const ProfileAddItem = () => {
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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

        if (!user?.currentCollege) {
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

            images.forEach((image) => data.append("images", image));

            // ✅ use shared http instance
            const response = await http.post("/api/item/add", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data?.success) {
                setSuccess("Item listed successfully!");
                setTimeout(() => {
                    navigate("/profile/manage-items");
                }, 1200);
            } else {
                setError(response.data?.message || "Failed to list item");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to list item. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user?.currentCollege) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-600 mb-4">
                    Please update your profile with your current college to start listing items.
                </p>
                <button
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Go to Edit Profile
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-extrabold text-slate-900">List New Item</h1>
            <p className="text-sm text-slate-500 mt-1">
                Share details about what you want to sell or rent.
            </p>

            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm border border-green-200">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-2xl">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="ex. Engineering Physics Textbook"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            required
                            maxLength="80"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe condition, reason for selling, etc."
                            rows="4"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            maxLength="2000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Condition
                            </label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                            >
                                {CONDITIONS.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="ex. semester1, notes, urgent"
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-semibold text-slate-900">Pricing & Type</h3>

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
                                    }))
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${formData.listingType === type.value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {formData.listingType === "sell" ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                required
                                min="0"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Rent Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="rentPrice"
                                    value={formData.rentPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Per
                                </label>
                                <select
                                    name="rentUnit"
                                    value={formData.rentUnit}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                >
                                    {RENT_UNITS.map((u) => (
                                        <option key={u.value} value={u.value}>
                                            {u.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Images (Min 1, Max 5)
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((src, i) => (
                            <div
                                key={i}
                                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
                            >
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {images.length < 5 && (
                            <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition aspect-square">
                                <span className="text-2xl text-slate-400">+</span>
                                <span className="text-xs text-slate-500 mt-1">Add</span>
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? "Listing..." : "Post Item"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileAddItem;
