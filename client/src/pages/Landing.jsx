import React from "react";
import { Link } from "react-router";

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-2xl p-6">
                <h1 className="text-3xl font-bold">UniTrade</h1>
                <p className="text-slate-300 mt-2">
                    Buy, sell, rent within your university — clean feed, verified community.
                </p>

                <div className="mt-6 flex gap-3">
                    <Link to="/login" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600">
                        Login
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
