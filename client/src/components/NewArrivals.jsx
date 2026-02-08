import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ItemCard from "./ItemCard";

const BACKEND_URL_RAW = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
const BACKEND_URL = BACKEND_URL_RAW.replace(/\/+$/, ""); // ✅ removes trailing slash

const NewArrivals = () => {
    const { user } = useSelector((s) => s.auth);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const collegeId = useMemo(() => {
        const c = user?.currentCollege;
        if (!c) return null;
        if (typeof c === "object") return c._id;
        return c; // if backend sends just id
    }, [user]);

    useEffect(() => {
        const fetchLatestItems = async () => {
            if (!collegeId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const { data } = await axios.get(`${BACKEND_URL}/api/item/list`, {
                    params: {
                        college: collegeId,
                        limit: 4,
                        page: 1,
                    },
                });

                if (data?.success) {
                    setItems(data.items || []);
                } else {
                    setItems([]);
                }
            } catch (err) {
                console.error("Failed to fetch new arrivals:", err?.response?.data || err.message);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestItems();
    }, [collegeId]);

    if (loading) {
        return (
            <section className="py-10">
                <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
                <p className="text-slate-500">Loading latest items…</p>
            </section>
        );
    }

    if (!items.length) {
        return (
            <section className="py-10">
                <h2 className="text-xl font-bold mb-4">New Arrivals</h2>
                <p className="text-slate-500">No items listed yet in your university.</p>
            </section>
        );
    }

    return (
        <section className="py-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900">New Arrivals</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;
