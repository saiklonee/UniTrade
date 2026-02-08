import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

const ROLES = [
    { value: "student", label: "Student" },
    { value: "faculty", label: "Faculty" },
];

const InputField = React.memo(({ label, type, value, onChange, placeholder, disabled, className = "" }) => {
    return (
        <div>
            <label className="text-xs text-slate-300">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
            />
        </div>
    );
});

const SelectField = React.memo(({ label, value, onChange, options, disabled, loading, loadingText, className = "" }) => {
    return (
        <div>
            <label className="text-xs text-slate-300">{label}</label>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled || loading}
                className={`mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
            >
                {loading ? (
                    <option value="" className="bg-slate-950">
                        {loadingText || "Loading..."}
                    </option>
                ) : (
                    <>
                        <option value="" className="bg-slate-950">Select...</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-950">
                                {option.label}
                            </option>
                        ))}
                    </>
                )}
            </select>
        </div>
    );
});

const ErrorMessage = React.memo(({ message, type = "error" }) => {
    if (!message) return null;

    const bgColor = type === "error" ? "bg-red-500/10 border-red-500/30 text-red-200" :
        type === "warning" ? "bg-amber-500/10 border-amber-500/30 text-amber-200" :
            "bg-blue-500/10 border-blue-500/30 text-blue-200";

    return (
        <div className={`mt-4 rounded-xl border ${bgColor} px-4 py-3 text-sm`}>
            {message}
        </div>
    );
});

const ModeSwitch = React.memo(({ mode, onChange }) => {
    return (
        <div className="flex rounded-full border border-white/10 bg-black/20 p-1">
            <button
                type="button"
                onClick={() => onChange("signin")}
                className={`px-3 py-1.5 text-sm rounded-full transition ${mode === "signin"
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white"
                    }`}
            >
                Sign in
            </button>
            <button
                type="button"
                onClick={() => onChange("signup")}
                className={`px-3 py-1.5 text-sm rounded-full transition ${mode === "signup"
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white"
                    }`}
            >
                Sign up
            </button>
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

    // Fetch colleges on mount
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                setLoadingColleges(true);
                setCollegesError("");

                const res = await axios.get("http://localhost:4000/api/college/list");

                if (res.data?.success) {
                    const list = res.data.colleges || [];
                    setColleges(list.map(college => ({
                        value: college._id,
                        label: college.name
                    })));
                } else {
                    setCollegesError(res.data?.message || "Failed to load colleges.");
                }
            } catch (err) {
                console.error("Error fetching colleges:", err);
                setCollegesError("Failed to load colleges. Make sure backend is running.");
            } finally {
                setLoadingColleges(false);
            }
        };

        fetchColleges();
    }, []);

    // Validation
    const canSubmitSignin = useMemo(() => {
        return signin.email.trim() && signin.password.trim();
    }, [signin]);

    const canSubmitSignup = useMemo(() => {
        const basicFields = signup.username.trim() &&
            signup.name.trim() &&
            signup.email.trim() &&
            signup.mobile.trim() &&
            signup.password.trim().length >= 6 &&
            signup.permanentCollege;

        // Mobile number validation (simple)
        const mobileValid = /^\d{10}$/.test(signup.mobile.trim());

        return basicFields && mobileValid;
    }, [signup]);

    // Event handlers
    const handleSigninChange = useCallback((field) => (e) => {
        setSignin(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    const handleSignupChange = useCallback((field) => (e) => {
        setSignup(prev => ({ ...prev, [field]: e.target.value }));
    }, []);

    const handleAvatarChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                e.target.value = ""; // Clear file input
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError("Only image files are allowed (JPEG, PNG, GIF, WebP)");
                e.target.value = "";
                return;
            }

            setAvatarFile(file);
            setError(""); // Clear any previous errors
        } else {
            setAvatarFile(null);
        }
    }, []);

    const switchMode = useCallback((next) => {
        setError("");
        setMode(next);
    }, []);

    // Build FormData for signup
    const buildSignupFormData = useCallback(() => {
        const formData = new FormData();

        // Append all fields from signup state
        formData.append("username", signup.username.trim().toLowerCase());
        formData.append("name", signup.name.trim());
        formData.append("email", signup.email.trim().toLowerCase());
        formData.append("mobile", signup.mobile.trim());
        formData.append("password", signup.password);
        formData.append("role", signup.role);
        formData.append("permanentCollege", signup.permanentCollege);

        // Append avatar file if exists
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        return formData;
    }, [signup, avatarFile]);

    // Sign in handler
    const handleSignin = async (e) => {
        e.preventDefault();
        setError("");

        if (!canSubmitSignin) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await axios.post(
                "http://localhost:4000/api/user/login",
                {
                    email: signin.email.trim().toLowerCase(),
                    password: signin.password
                },
                { withCredentials: true }
            );

            if (!res.data?.success) {
                setError(res.data?.message || "Login failed.");
                return;
            }

            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect to dashboard
            window.location.href = "/dashboard";

        } catch (err) {
            console.error("Login error:", err);
            setError(err?.response?.data?.message || "Login failed. Check your credentials.");
        } finally {
            setSubmitting(false);
        }
    };

    // Sign up handler
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!canSubmitSignup) {
            setError("Please fill all required fields correctly. Mobile must be 10 digits.");
            return;
        }

        // Role validation (only student/faculty allowed for signup)
        if (!["student", "faculty"].includes(signup.role)) {
            setError("Invalid role selected.");
            return;
        }

        try {
            setSubmitting(true);

            // Build FormData with avatar file
            const formData = buildSignupFormData();

            // Send to backend (backend will handle file upload)
            const res = await axios.post(
                "http://localhost:4000/api/user/register",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (!res.data?.success) {
                setError(res.data?.message || "Signup failed.");
                return;
            }

            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect to dashboard
            window.location.href = "/dashboard";

        } catch (err) {
            console.error("Signup error:", err);

            // Handle specific error cases
            if (err.response?.status === 409) {
                setError(err.response?.data?.message || "User already exists with this email, username, or mobile.");
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || "Invalid data provided.");
            } else if (err.code === "ERR_NETWORK") {
                setError("Cannot connect to server. Make sure backend is running.");
            } else {
                setError("Signup failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                    {/* Top gradient */}
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500" />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h1 className="text-xl font-semibold">
                                    {mode === "signin" ? "Welcome back" : "Create your account"}
                                </h1>
                                <p className="text-sm text-slate-300 mt-1">
                                    {mode === "signin"
                                        ? "Sign in to continue."
                                        : "Sign up as Student or Faculty."}
                                </p>
                            </div>

                            {/* Mode switch */}
                            <ModeSwitch mode={mode} onChange={switchMode} />
                        </div>

                        {/* Error messages */}
                        <ErrorMessage message={error} type="error" />
                        <ErrorMessage message={collegesError} type="warning" />

                        {/* Forms */}
                        {mode === "signin" ? (
                            <form onSubmit={handleSignin} className="mt-5 space-y-4">
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={signin.email}
                                    onChange={handleSigninChange('email')}
                                    placeholder="you@example.com"
                                />

                                <InputField
                                    label="Password"
                                    type="password"
                                    value={signin.password}
                                    onChange={handleSigninChange('password')}
                                    placeholder="••••••••"
                                />

                                <button
                                    type="submit"
                                    disabled={submitting || !canSubmitSignin}
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition
                                        bg-indigo-500 hover:bg-indigo-400
                                        disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed`}
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
                            <form onSubmit={handleSignup} className="mt-5 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InputField
                                        label="Username"
                                        type="text"
                                        value={signup.username}
                                        onChange={handleSignupChange('username')}
                                        placeholder="saiprithvi"
                                        required
                                    />

                                    <InputField
                                        label="Full name"
                                        type="text"
                                        value={signup.name}
                                        onChange={handleSignupChange('name')}
                                        placeholder="Sai Prithvi"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={signup.email}
                                        onChange={handleSignupChange('email')}
                                        placeholder="you@example.com"
                                        required
                                    />

                                    <InputField
                                        label="Mobile"
                                        type="text"
                                        value={signup.mobile}
                                        onChange={handleSignupChange('mobile')}
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>

                                <InputField
                                    label="Password (minimum 6 characters)"
                                    type="password"
                                    value={signup.password}
                                    onChange={handleSignupChange('password')}
                                    placeholder="••••••••"
                                    required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <SelectField
                                        label="Role"
                                        value={signup.role}
                                        onChange={handleSignupChange('role')}
                                        options={ROLES}
                                        required
                                    />

                                    <SelectField
                                        label="College"
                                        value={signup.permanentCollege}
                                        onChange={handleSignupChange('permanentCollege')}
                                        options={colleges}
                                        loading={loadingColleges}
                                        loadingText="Loading colleges..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-300">Avatar (optional)</label>
                                    <input
                                        type="file"
                                        accept=".jpeg,.jpg,.png,.gif,.webp,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleAvatarChange}
                                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-200 hover:file:bg-white/15"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Maximum file size: 5MB. Allowed formats: JPEG, PNG, GIF, WebP
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !canSubmitSignup}
                                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition
                                        bg-indigo-500 hover:bg-indigo-400
                                        disabled:opacity-50 disabled:hover:bg-indigo-500 disabled:cursor-not-allowed`}
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

                {/* Footer */}
                <p className="mt-4 text-center text-xs text-slate-400">
                    By continuing, you agree to the platform rules of your college.
                </p>
            </div>
        </div>
    );
}