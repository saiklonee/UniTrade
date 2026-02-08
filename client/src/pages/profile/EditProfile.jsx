import React from "react";
import { useSelector } from "react-redux";

const EditProfile = () => {
    const { user } = useSelector((s) => s.auth);

    return (
        <div>
            <h1 className="text-xl font-extrabold text-slate-900">Edit Profile</h1>
            <p className="text-sm text-slate-500 mt-1">
                Update your name, mobile, avatar, and current college.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-sm text-slate-700">
                    <b>Current user:</b> {user?.name} ({user?.email})
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    (Next step: we’ll wire PATCH <code>/api/user/me</code> here.)
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
