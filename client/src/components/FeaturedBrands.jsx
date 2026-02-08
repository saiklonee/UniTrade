import React from "react";
import Marquee from "react-fast-marquee";

const brands = [
    { logo: "/brands/apple.png" },
    { logo: "/brands/rog.png" },
    { logo: "/brands/sony.png" },
    { logo: "/brands/casio.png" },
    { logo: "/brands/secretlab.png" },
    { logo: "/brands/nvidia.png" },
    { logo: "/brands/playstation.png" },
    { logo: "/brands/logitech.png" },
];

const FeaturedBrands = () => {
    return (
        <section className="w-full py-10 my-10 md:my-25">
            <div className="px-4 md:px-10">
                <div className="flex items-end justify-between gap-4 mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight ">
                        Featured Brands
                    </h2>
                    <p className="text-sm text-gray-400">
                        Trusted names. Premium gear.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">

                    <Marquee
                        speed={45}
                        gradient={true}
                        pauseOnHover
                        autoFill
                    >
                        {brands.map((b, idx) => (
                            <div
                                key={idx}
                                className="mx-8 flex items-center justify-center rounded-xl border border-white/10"
                            >
                                <img
                                    src={b.logo}
                                    alt="brand logo"
                                    className="h-8 md:h-10 object-contain  hover:opacity-100 transition"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>
        </section>
    );
};

export default FeaturedBrands;
