import React from "react";

const Spinner = ({
    size = 18,
    className = "",
    label = "Loading",
    showLabel = false,
}) => {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <span
                className="inline-block rounded-full border-2 border-white/30 border-t-white animate-spin"
                style={{ width: size, height: size }}
                aria-label={label}
                role="status"
            />
            {showLabel && <span className="text-sm">{label}</span>}
        </span>
    );
};

export default Spinner;
