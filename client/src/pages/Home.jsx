import React from "react";
import { useNavigate } from "react-router-dom";
import MainBanner from "../components/MainBanner";
import NewArrivals from "../components/NewArrivals";
import { ArrowRight, Laptop, BookOpen, Armchair, Shirt, Dumbbell, MoreHorizontal } from "lucide-react";
import FeaturedBrands from "../components/FeaturedBrands";

// Mock Categories
const CATEGORIES = [
    { name: "Electronics", icon: <Laptop />, color: "bg-blue-100 text-blue-600" },
    { name: "Books", icon: <BookOpen />, color: "bg-amber-100 text-amber-600" },
    { name: "Furniture", icon: <Armchair />, color: "bg-emerald-100 text-emerald-600" },
    { name: "Clothing", icon: <Shirt />, color: "bg-purple-100 text-purple-600" },
    { name: "Sports", icon: <Dumbbell />, color: "bg-red-100 text-red-600" },
    { name: "Other", icon: <MoreHorizontal />, color: "bg-gray-100 text-gray-600" },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Hero Section */}
            <MainBanner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-12">

                {/* Categories */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                        <button
                            onClick={() => navigate("/products")}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {CATEGORIES.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate("/products")} // Ideally filter by category
                                className="group cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {React.cloneElement(cat.icon, { size: 24 })}
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-black">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* New Arrivals */}
                <div>
                    <NewArrivals />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FeaturedBrands />
            </div>
        </div>
    );
};

export default Home;