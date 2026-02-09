import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../redux/features/auth/authSlice"; // You implemented this
import { clearAuthError } from "../../redux/features/auth/authSlice";
import { fetchColleges } from "../../redux/features/colleges/collegesSlice"; // Assuming this exists or similar

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, status, error } = useSelector((s) => s.auth);
    const { list: colleges } = useSelector((s) => s.colleges); // Assuming college slice structure

    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "",
            currentCollege: user?.currentCollege?._id || user?.currentCollege || "",
        },
    });

    useEffect(() => {
        dispatch(fetchColleges());
    }, [dispatch]);

    // Update form when user data is available (e.g. on refresh)
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("mobile", user.mobile);
            // Handle different college object structures if necessary
            const collegeId = typeof user.currentCollege === 'object' ? user.currentCollege?._id : user.currentCollege;
            setValue("currentCollege", collegeId || "");
            setAvatarPreview(user.avatarUrl);
        }
    }, [user, setValue]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("mobile", data.mobile);
        formData.append("currentCollege", data.currentCollege);

        const fileInput = document.getElementById("avatar-upload");
        if (fileInput?.files?.[0]) {
            formData.append("avatar", fileInput.files[0]);
        }

        dispatch(updateProfile(formData));
    };

    // Clear errors on unmount
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    return (
        <div>
            <h1 className="text-xl font-extrabold text-slate-900">Edit Profile</h1>
            <p className="text-sm text-slate-500 mt-1">
                Update your personal details.
            </p>

            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {status === "succeeded" && !error && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-600 text-sm border border-green-200">
                    Profile updated successfully!
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 max-w-xl">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-xs font-medium"
                        >
                            Change
                        </label>
                    </div>
                    <div>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition shadow-sm"
                        >
                            Upload New Picture
                        </label>
                        <p className="text-xs text-slate-500 mt-2">
                            JPG, GIF or PNG. Max 5MB.
                        </p>
                    </div>
                </div>

                {/* Fields Grid */}
                <div className="grid gap-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email - Read Only */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address <span className="text-xs font-normal text-slate-400">(Read-only)</span>
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            readOnly
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            {...register("mobile", {
                                required: "Mobile number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid 10-digit mobile number",
                                },
                            })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                        {errors.mobile && (
                            <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>
                        )}
                    </div>

                    {/* College */}
                    <div className="">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Current College
                        </label>
                        <select
                            {...register("currentCollege", { required: "Please select your college" })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-white"
                        >
                            <option value="">Select College</option>
                            {colleges.map((college) => (
                                <option key={college._id} value={college._id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                        {errors.currentCollege && (
                            <p className="text-xs text-red-500 mt-1">{errors.currentCollege.message}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                            Changing college will update your feed recommendations.
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {status === "loading" ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
