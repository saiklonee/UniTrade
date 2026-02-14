import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { http } from "../../api/http";

const AdminUsers = () => {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");

    const [q, setQ] = useState("");
    const [role, setRole] = useState("all"); // all | student | faculty | admin
    const [blocked, setBlocked] = useState("all"); // all | blocked | active

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return rows.filter((u) => {
            const matchesQ =
                !qq ||
                u?.name?.toLowerCase()?.includes(qq) ||
                u?.username?.toLowerCase()?.includes(qq) ||
                u?.email?.toLowerCase()?.includes(qq) ||
                String(u?.mobile || "").toLowerCase().includes(qq);

            const matchesRole = role === "all" || u?.role === role;
            const isBlocked = !!u?.isBlocked;
            const matchesBlocked =
                blocked === "all" || (blocked === "blocked" ? isBlocked : !isBlocked);

            return matchesQ && matchesRole && matchesBlocked;
        });
    }, [rows, q, role, blocked]);

    const load = async () => {
        try {
            setLoading(true);
            setError("");

            // ✅ your backend: GET /api/user/
            const res = await http.get("/api/user");
            if (!res.data?.success) throw new Error(res.data?.message || "Failed to load users");

            // controller may return users in different keys:
            const users = res.data.users || res.data.data || res.data?.payload || [];
            setRows(Array.isArray(users) ? users : []);
        } catch (e) {
            setError(e.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const toggleBlock = async (userId, nextBlocked) => {
        try {
            // ✅ your backend: PATCH /api/user/:id/block
            const res = await http.patch(`/api/user/${userId}/block`, { isBlocked: nextBlocked });
            if (!res.data?.success) throw new Error(res.data?.message || "Action failed");

            toast.success(nextBlocked ? "User blocked" : "User unblocked");
            setRows((prev) => prev.map((u) => (u._id === userId ? { ...u, isBlocked: nextBlocked } : u)));
        } catch (e) {
            toast.error(e.message || "Action failed");
        }
    };

    const deleteUser = async (userId) => {
        const ok = window.confirm("Delete this user permanently? This cannot be undone.");
        if (!ok) return;

        try {
            // ✅ your backend: DELETE /api/user/:id
            const res = await http.delete(`/api/user/${userId}`);
            if (!res.data?.success) throw new Error(res.data?.message || "Delete failed");

            toast.success("User deleted");
            setRows((prev) => prev.filter((u) => u._id !== userId));
        } catch (e) {
            toast.error(e.message || "Delete failed");
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900">Users</h1>
                    <p className="text-sm text-slate-500 mt-1">Block/unblock or delete users.</p>
                </div>

                <button
                    onClick={load}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition"
                >
                    Refresh
                </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search name / username / email / mobile..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                    <option value="all">All roles</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                </select>
                <select
                    value={blocked}
                    onChange={(e) => setBlocked(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                    <option value="all">All status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-6 text-sm text-slate-500">Loading users...</div>
            ) : (
                <div className="mt-6 overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="min-w-full bg-white">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filtered.map((u) => {
                                const name = u?.name || u?.username || "User";
                                return (
                                    <tr key={u._id} className="text-sm">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                    {u?.avatarUrl ? (
                                                        <img src={u.avatarUrl} alt={name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-bold text-slate-600">
                                                            {name.slice(0, 1).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900 truncate">{name}</div>
                                                    <div className="text-xs text-slate-500 truncate">{u?.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {u?.role || "—"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">
                                            {u?.isBlocked ? (
                                                <span className="inline-flex rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                    Active
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleBlock(u._id, !u?.isBlocked)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${u?.isBlocked
                                                        ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                                                        : "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                                        }`}
                                                >
                                                    {u?.isBlocked ? "Unblock" : "Block"}
                                                </button>

                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
