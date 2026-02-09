import { Link } from "react-router";
import DotGrid from "../components/bg/DotGrid";
import logo from "/store.svg";

export default function Landing() {
    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <DotGrid
                    dotSize={5}
                    gap={15}
                    baseColor="#271E37"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

            {/* Glow accents */}
            <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-260px] right-[-220px] h-[620px] w-[620px] rounded-full bg-fuchsia-600/10 blur-3xl" />

            {/* Content wrapper */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
                {/* NAVBAR */}
                <header className="sticky top-0 z-20 pt-5">
                    <div
                        className="
              relative overflow-hidden rounded-2xl
              border border-white/10
              bg-white/[0.06] backdrop-blur-xl
              shadow-[0_12px_40px_-18px_rgba(0,0,0,0.9)]
            "
                    >
                        {/* subtle shine */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/8 via-white/3 to-transparent" />


                        <div className="relative flex items-center justify-between px-4 sm:px-6 py-3">
                            <Link to="/" className="flex items-center gap-3">
                                <img
                                    src={logo}
                                    alt="UniTrade"
                                    className="h-9 w-auto select-none"
                                    draggable={false}
                                />
                                <div className="hidden sm:flex flex-col leading-tight">
                                    <span className="text-white/90 font-semibold tracking-tight">
                                        UniTrade
                                    </span>
                                    <span className="text-[11px] text-white/45">
                                        Secure campus marketplace
                                    </span>
                                </div>
                            </Link>

                            <div className="flex items-center gap-3">
                                <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Live
                                </span>

                                <Link
                                    to="/login"
                                    className="
                    inline-flex items-center justify-center rounded-xl px-4 py-2
                    text-sm font-semibold text-white
                    bg-white/10 hover:bg-white/15
                    border border-white/10
                    transition
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                  "
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* HERO */}
                <main className="min-h-[calc(100vh-96px)] flex items-center justify-center pb-12 pt-10 sm:pt-14">
                    <div className="w-full max-w-3xl">
                        <div
                            className="
                relative overflow-hidden rounded-3xl
                border border-white/10
                bg-white/[0.055] backdrop-blur-xl
                shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
              "
                        >
                            {/* top highlight */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

                            {/* inner ring */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

                            {/* corner glow */}
                            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

                            <div className="relative p-7 sm:p-11">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                        College-only marketplace
                                    </p>

                                    <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                                        Verified campus feed • No spam
                                    </p>
                                </div>

                                <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                                    Buy, sell, and rent —{" "}
                                    <span className="text-indigo-300">within your university</span>
                                </h1>

                                <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                                    A clean, trusted marketplace for students. Discover listings from your
                                    campus community only—fast, minimal, and focused.
                                </p>

                                {/* Feature chips */}
                                <div className="mt-7 flex flex-wrap gap-2">
                                    {[
                                        "College-scoped feed",
                                        "Wishlist & save",
                                        "Rent or sell items",
                                        "Secure login",
                                        "Fresh arrivals",
                                    ].map((t) => (
                                        <span
                                            key={t}
                                            className="
                        rounded-xl border border-white/10 bg-white/5
                        px-3 py-1.5 text-xs text-white/80
                      "
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="mt-9 flex">
                                    <Link
                                        to="/login"
                                        className="
                      inline-flex w-full sm:w-auto items-center justify-center
                      rounded-2xl px-6 py-3 font-semibold text-white
                      bg-indigo-500 hover:bg-indigo-600
                      transition shadow-lg shadow-indigo-500/20
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                    "
                                    >
                                        Continue to Login
                                    </Link>
                                </div>

                                <p className="mt-6 text-xs text-white/45">
                                    By continuing, you agree to UniTrade’s basic usage policy.
                                </p>
                            </div>
                        </div>

                        {/* Footer note */}
                        <div className="mt-6 text-center text-xs text-white/40">
                            Built for campus communities • Fast • Minimal • Verified
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
