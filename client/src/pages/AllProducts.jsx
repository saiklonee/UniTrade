import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedItems } from "../redux/features/items/itemsSlice";
import ItemCard from "../components/ItemCard";
import { Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// Categories (Mock data - ideally should be fetched or from constants)
const CATEGORIES = ["Electronics", "Books", "Furniture", "Clothing", "Sports", "Other"];
const PRICES = ["Under ₹500", "₹500 - ₹2000", "₹2000 - ₹5000", "Above ₹5000"];

const AllProducts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { slug } = useParams(); // Get category from URL if present

    const { feed, feedStatus } = useSelector((s) => s.items);
    const { user } = useSelector((s) => s.auth);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedPrice, setSelectedPrice] = useState("All");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Sync URL param with state
    useEffect(() => {
        if (slug) {
            // Capitalize first letter to match mock data if needed, or strict match
            // Assuming slug is like "Electronics" or "electronics"
            const categoryMatch = CATEGORIES.find(c => c.toLowerCase() === slug.toLowerCase());
            if (categoryMatch) {
                setSelectedCategory(categoryMatch);
            } else {
                setSelectedCategory("All");
            }
        } else {
            setSelectedCategory("All");
        }
    }, [slug]);

    useEffect(() => {
        // Fetch items if not already fetched or if needed
        if (feedStatus === "idle" && user?.currentCollege) {
            // If user has a college, pass it. API logic handles the rest.
            dispatch(fetchFeedItems({ collegeId: user.currentCollege }));
        }
    }, [dispatch, feedStatus, user]);


    // Client-side filtering (for now, until API supports detailed filtering parameters)
    const filteredItems = useMemo(() => {
        return feed.filter(item => {
            if (selectedCategory !== "All" && item.category !== selectedCategory) return false;

            if (selectedPrice !== "All") {
                const price = item.price || item.rentPrice || 0;
                if (selectedPrice === "Under ₹500" && price >= 500) return false;
                if (selectedPrice === "₹500 - ₹2000" && (price < 500 || price > 2000)) return false;
                if (selectedPrice === "₹2000 - ₹5000" && (price < 2000 || price > 5000)) return false;
                if (selectedPrice === "Above ₹5000" && price <= 5000) return false;
            }
            return true;
        });
    }, [feed, selectedCategory, selectedPrice]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        if (cat === "All") {
            navigate("/products");
        } else {
            navigate(`/category/${cat}`);
        }
    }


    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {selectedCategory === "All" ? "All Products" : selectedCategory}
                        </h1>
                        <p className="text-gray-500 mt-1">Explore items from your college community.</p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <Filter size={16} /> Filters
                    </button>

                    {/* Sort Dropdown (Mock) */}
                    <div className="hidden md:block relative">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
                            Sort by: Newest <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`md:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-6">
                                <SlidersHorizontal size={20} /> Filters
                            </div>

                            {/* Category Filter */}
                            <div className="mb-8">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                            checked={selectedCategory === "All"}
                                            onChange={() => handleCategoryChange("All")}
                                        />
                                        <span className={`text-sm group-hover:text-black transition-colors ${selectedCategory === "All" ? 'text-black font-medium' : 'text-gray-600'}`}>All Categories</span>
                                    </label>
                                    {CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                                checked={selectedCategory === cat}
                                                onChange={() => handleCategoryChange(cat)}
                                            />
                                            <span className={`text-sm group-hover:text-black transition-colors ${selectedCategory === cat ? 'text-black font-medium' : 'text-gray-600'}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="price"
                                            className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                            checked={selectedPrice === "All"}
                                            onChange={() => setSelectedPrice("All")}
                                        />
                                        <span className={`text-sm group-hover:text-black transition-colors ${selectedPrice === "All" ? 'text-black font-medium' : 'text-gray-600'}`}>Any Price</span>
                                    </label>
                                    {PRICES.map(range => (
                                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="price"
                                                className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                                                checked={selectedPrice === range}
                                                onChange={() => setSelectedPrice(range)}
                                            />
                                            <span className={`text-sm group-hover:text-black transition-colors ${selectedPrice === range ? 'text-black font-medium' : 'text-gray-600'}`}>{range}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {feedStatus === "loading" ? (
                            <div className="text-center py-24">
                                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                <button onClick={() => { handleCategoryChange("All"); setSelectedPrice("All"); }} className="mt-4 text-blue-600 hover:underline">Clear Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
                                {filteredItems.map(item => (
                                    <ItemCard key={item._id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;