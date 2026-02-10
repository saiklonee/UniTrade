import React, { useEffect, useMemo, useState, useCallback } from "react";
import { http } from "../api/http";

const ROLES = [
    { value: "student", label: "Student" },
    { value: "faculty", label: "Faculty" },
];

const InputField = React.memo(
    ({ label, type, value, onChange, placeholder, disabled, className = "" }) => (
        <div className="space-y-1">
            <label className="text-xs text-slate-300">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none
        focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 ${className}`}
            />
        </div>
    )
);

const SelectField = React.memo(
    ({ label, value, onChange, options, disabled, loading, loadingText, className = "" }) => (
        <div className="space-y-1">
            <label className="text-xs text-slate-300">{label}</label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled || loading}
                className={`w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none
        focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 ${className}`}
            >
                {loading ? (
                    <option value="" className="bg-slate-950">
                        {loadingText || "Loading..."}
                    </option>
                ) : (
                    <>
                        <option value="" className="bg-slate-950">
                            Select...
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-950">
                                {option.label}
                            </option>
                        ))}
                    </>
                )}
            </select>
        </div>
    )
);

const ErrorMessage = React.memo(({ message, type = "error" }) => {
    if (!message) return null;

    const styles =
        type === "error"
            ? "bg-red-500/10 border-red-500/30 text-red-200"
            : type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "bg-blue-500/10 border-blue-500/30 text-blue-200";

    return <div className={`mt-4 rounded-xl border ${styles} px-4 py-3 text-sm`}>{message}</div>;
});

const ModeSwitch = React.memo(({ mode, onChange }) => (
    <div className="flex items-center rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur-xl">
        <button
            type="button"
            onClick={() => onChange("signin")}
            className={`px-3 py-1.5 text-sm rounded-full transition
      ${mode === "signin" ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
        >
            Sign in
        </button>
        <button
            type="button"
            onClick={() => onChange("signup")}
            className={`px-3 py-1.5 text-sm rounded-full transition
      ${mode === "signup" ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
        >
            Sign up
        </button>
    </div>
));

const FilePill = React.memo(({ filename }) => {
    if (!filename) return null;
    return (
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Selected: <span className="text-white/90 font-medium">{filename}</span>
        </div>
    );
});

export default function Login() {
    const [mode, setMode] = useState("signin");

    // Colleges for dropdown
    const [colleges, setColleges] = useState([]);
    const [loadingColleges, setLoadingColleges] = useState(true);
    const [collegesError, setCollegesError] = useState("");

    // UI states
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Sign in form
    const [signin, setSignin] = useState({ email: "", password: "" });

    // Sign up form
    const [signup, setSignup] = useState({
        username: "",
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "student",
        permanentCollege: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                setLoadingColleges(true);
                setCollegesError("");

                const res = await http.get("/api/college/list");

                if (res.data?.success) {
                    const list = res.data.colleges || [];
                    setColleges(
                        list.map((college) => ({
                            value: college._id,
                            label: college.name,
                        }))
                    );
                } else {
                    setCollegesError(res.data?.message || "Failed to load colleges.");
                }
            } catch (err) {
                console.error("Error fetching colleges:", err);
                setCollegesError(err?.response?.data?.message || "Failed to load colleges.");
            } finally {
                setLoadingColleges(false);
            }
        };

        fetchColleges();
    }, []);

    const canSubmitSignin = useMemo(() => signin.email.trim() && signin.password.trim(), [signin]);

    const canSubmitSignup = useMemo(() => {
        const basicFields =
            signup.username.trim() &&
            signup.name.trim() &&
            signup.email.trim() &&
            signup.mobile.trim() &&
            signup.password.trim().length >= 6 &&
            signup.permanentCollege;

        const mobileValid = /^\d{10}$/.test(signup.mobile.trim());
        return basicFields && mobileValid;
    }, [signup]);

    const handleSigninChange = useCallback(
        (field) => (e) => setSignin((prev) => ({ ...prev, [field]: e.target.value })),
        []
    );

    const handleSignupChange = useCallback(
        (field) => (e) => setSignup((prev) => ({ ...prev, [field]: e.target.value })),
        []
    );

    const handleAvatarChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                e.target.value = "";
                return;
            }
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                setError("Only image files are allowed (JPEG, PNG, GIF, WebP)");
                e.target.value = "";
                return;
            }
            setAvatarFile(file);
            setError("");
        } else {
            setAvatarFile(null);
        }
    }, []);

    const switchMode = useCallback((next) => {
        setError("");
        setMode(next);
    }, []);

    const buildSignupFormData = useCallback(() => {
        const formData = new FormData();
        formData.append("username", signup.username.trim().toLowerCase());
        formData.append("name", signup.name.trim());
        formData.append("email", signup.email.trim().toLowerCase());
        formData.append("mobile", signup.mobile.trim());
        formData.append("password", signup.password);
        formData.append("role", signup.role);
        formData.append("permanentCollege", signup.permanentCollege);
        if (avatarFile) formData.append("avatar", avatarFile);
        return formData;
    }, [signup, avatarFile]);

    const handleSignin = async (e) => {
        e.preventDefault();
        setError("");

        if (!canSubmitSignin) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setSubmitting(true);

            // ✅ use shared http client
            const res = await http.post("/api/user/login", {
                email: signin.email.trim().toLowerCase(),
                password: signin.password,
            });

            if (!res.data?.success) {
                setError(res.data?.message || "Login failed.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Login error:", err);
            setError(err?.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!canSubmitSignup) {
            setError("Please fill all required fields correctly. Mobile must be 10 digits.");
            return;
        }

        if (!["student", "faculty"].includes(signup.role)) {
            setError("Invalid role selected.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = buildSignupFormData();

            // ✅ use shared http client
            const res = await http.post("/api/user/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!res.data?.success) {
                setError(res.data?.message || "Signup failed.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Signup error:", err);
            if (err.response?.status === 409) {
                setError(err.response?.data?.message || "User already exists with this email, username, or mobile.");
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || "Invalid data provided.");
            } else if (err.code === "ERR_NETWORK") {
                setError("Cannot connect to server. Make sure backend is running.");
            } else {
                setError(err?.response?.data?.message || "Signup failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-slate-100 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-fuchsia-600/10 blur-3xl" />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.55)] overflow-hidden">
                        <div className="p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs text-white/60">Secure • College-only • Verified</p>
                                    <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">
                                        {mode === "signin" ? "Welcome back" : "Create your account"}
                                    </h1>
                                    <p className="text-sm text-slate-300 mt-1">
                                        {mode === "signin" ? "Sign in to continue." : "Sign up as Student or Faculty."}
                                    </p>
                                </div>

                                <ModeSwitch mode={mode} onChange={switchMode} />
                            </div>

                            <ErrorMessage message={error} type="error" />
                            <ErrorMessage message={collegesError} type="warning" />

                            {mode === "signin" ? (
                                <form onSubmit={handleSignin} className="mt-6 space-y-4">
                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={signin.email}
                                        onChange={handleSigninChange("email")}
                                        placeholder="you@example.com"
                                    />

                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={signin.password}
                                        onChange={handleSigninChange("password")}
                                        placeholder="••••••••"
                                    />

                                    <button
                                        type="submit"
                                        disabled={submitting || !canSubmitSignin}
                                        className="
                      w-full rounded-2xl px-4 py-3 text-sm font-semibold
                      bg-indigo-500 hover:bg-indigo-600
                      transition shadow-lg shadow-indigo-500/20
                      disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                    "
                                    >
                                        {submitting ? "Signing in..." : "Sign in"}
                                    </button>

                                    <p className="text-sm text-slate-300 text-center">
                                        New here?{" "}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("signup")}
                                            className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                                        >
                                            Create an account
                                        </button>
                                    </p>
                                </form>
                            ) : (
                                <form onSubmit={handleSignup} className="mt-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField
                                            label="Username"
                                            type="text"
                                            value={signup.username}
                                            onChange={handleSignupChange("username")}
                                            placeholder="saiprithvi"
                                        />

                                        <InputField
                                            label="Full name"
                                            type="text"
                                            value={signup.name}
                                            onChange={handleSignupChange("name")}
                                            placeholder="Sai Prithvi"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField
                                            label="Email"
                                            type="email"
                                            value={signup.email}
                                            onChange={handleSignupChange("email")}
                                            placeholder="you@example.com"
                                        />

                                        <InputField
                                            label="Mobile"
                                            type="text"
                                            value={signup.mobile}
                                            onChange={handleSignupChange("mobile")}
                                            placeholder="9876543210"
                                        />
                                    </div>

                                    <InputField
                                        label="Password (minimum 6 characters)"
                                        type="password"
                                        value={signup.password}
                                        onChange={handleSignupChange("password")}
                                        placeholder="••••••••"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <SelectField
                                            label="Role"
                                            value={signup.role}
                                            onChange={handleSignupChange("role")}
                                            options={ROLES}
                                        />

                                        <SelectField
                                            label="College"
                                            value={signup.permanentCollege}
                                            onChange={handleSignupChange("permanentCollege")}
                                            options={colleges}
                                            loading={loadingColleges}
                                            loadingText="Loading colleges..."
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-300">Avatar (optional)</label>
                                        <input
                                            type="file"
                                            accept=".jpeg,.jpg,.png,.gif,.webp,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleAvatarChange}
                                            className="
                        w-full rounded-xl border border-white/10 bg-white/[0.06]
                        px-4 py-3 text-sm
                        file:mr-4 file:rounded-lg file:border-0 file:bg-white/10
                        file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white/80
                        hover:file:bg-white/15
                      "
                                        />
                                        <p className="text-[11px] text-slate-400">Max 5MB • JPEG / PNG / GIF / WebP</p>
                                        <FilePill filename={avatarFile?.name} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || !canSubmitSignup}
                                        className="
                      w-full rounded-2xl px-4 py-3 text-sm font-semibold
                      bg-indigo-500 hover:bg-indigo-600
                      transition shadow-lg shadow-indigo-500/20
                      disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/60
                    "
                                    >
                                        {submitting ? "Creating account..." : "Create account"}
                                    </button>

                                    <p className="text-sm text-slate-300 text-center">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("signin")}
                                            className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>

                    <p className="mt-5 text-center text-xs text-white/40">
                        By continuing, you agree to your college platform rules.
                    </p>
                </div>
            </div>
        </div>
    );
}
