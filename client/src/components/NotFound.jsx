import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div class="flex flex-col items-center justify-center text-sm max-md:px-4">
            <h1 class="text-8xl md:text-9xl font-bold text-primary">404</h1>
            <div class="h-1 w-16 rounded bg-primary my-5 md:my-7" />
            <p class="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
            <p class="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
            </p>
            <div class="flex items-center gap-4 mt-6">
                <Link
                    to="/"
                    class="bg-gray-800 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;