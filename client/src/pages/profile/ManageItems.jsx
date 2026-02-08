import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// You will create this slice next (or keep as placeholder)
const ManageItems = () => {
    const { user } = useSelector((s) => s.auth);

    useEffect(() => {
        // later: dispatch(fetchMyItems())
    }, []);

    return (
        <div>
            <h1 className="text-xl font-extrabold text-slate-900">Manage Items</h1>
            <p className="text-sm text-slate-500 mt-1">
                View your listed items and mark sold (set inactive), edit, or delete.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-sm text-slate-700">
                    <b>Seller:</b> {user?.name || user?.username}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    (Next step: GET <code>/api/item/my-items</code> + actions: PUT update, PATCH toggle, DELETE remove.)
                </div>
            </div>
        </div>
    );
};

export default ManageItems;
