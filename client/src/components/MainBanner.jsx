import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { assets } from "../assets/assets";
import gsap from "gsap";

export default function MainBanner() {
    const navigate = useNavigate();

    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const paraRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([titleRef.current, paraRef.current, ctaRef.current], { opacity: 0 });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
                titleRef.current,
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9 }
            )
                .fromTo(
                    paraRef.current,
                    { y: 26, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.45"
                )
                .fromTo(
                    ctaRef.current,
                    { y: 14, opacity: 0, scale: 0.98 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.7 },
                    "-=0.35"
                );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            className="relative w-full h-[85vh] overflow-hidden flex items-center justify-center p-6"
        >
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={assets.home_banner_two}
                    alt="Tech store background"
                    className="w-full h-full object-cover"
                />
                {/* soft overlay for readability */}
                <div className="absolute inset-0 bg-black/35" />
            </div>

            <div className="absolute left-6 md:left-10 bottom-10 md:bottom-14">
                <div className="relative z-10 max-w-4xl space-y-6">
                    <h1
                        ref={titleRef}
                        className="text-4xl md:text-6xl font-bold text-white leading-tight"
                    >
                        A marketplace of your university
                    </h1>

                    <p ref={paraRef} className="text-base md:text-xl text-white/90 max-w-2xl">
                        Explore the latest gadgets, gear, and electronics at unbeatable prices.
                    </p>

                    <div ref={ctaRef} className="flex gap-4">
                        <button
                            onClick={() => navigate("/products")}
                            className="text-base md:text-lg px-6 py-3 rounded-md shadow-lg cursor-pointer bg-primary text-white flex items-center hover:bg-primary-dull transition"
                        >
                            Shop Now
                            <ShoppingCart className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
