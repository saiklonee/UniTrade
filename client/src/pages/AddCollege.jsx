import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";

/**
 * UniTrade - College API Test Page
 * Backend base: http://localhost:4000
 *
 * Expected routes (custom paths):
 * POST   /api/college/add         (multipart/form-data: fields + optional logo/image files)
 * GET    /api/college/list
 * GET    /api/college/get/:id
 * PUT    /api/college/update/:id  (multipart/form-data: fields + optional logo/image files)
 * DELETE /api/college/remove/:id
 */

const API_BASE = "http://localhost:4000";
const COLLEGES_API = `${API_BASE}/api/college`;

// Memoized child components to prevent unnecessary re-renders
const MsgBar = React.memo(({ message, onClose }) => {
    if (!message.text) return null;
    const bg = message.type === "success" ? "#e9fbe9" : "#ffecec";
    const border = message.type === "success" ? "#2f9e44" : "#e03131";
    const color = message.type === "success" ? "#1b5e20" : "#8a1f1f";
    return (
        <div
            style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
            }}
        >
            <div style={{ fontSize: 14 }}>{message.text}</div>
            <button
                onClick={onClose}
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 16,
                    lineHeight: 1,
                }}
                aria-label="close"
                title="Close"
            >
                ✕
            </button>
        </div>
    );
});

const Card = React.memo(({ title, children, right }) => (
    <div
        style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                marginBottom: 12,
            }}
        >
            <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
            {right}
        </div>
        {children}
    </div>
));

const CollegeList = React.memo(
    ({
        colleges,
        selectedId,
        loadingList,
        loadingGet,
        deletingId,
        onSelect,
        onRefresh,
        onGetById,
        onDelete,
    }) => {
        const labelStyle = { fontSize: 12, color: "#333", marginBottom: 6 };
        const inputStyle = {
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
            fontSize: 14,
        };

        return (
            <Card
                title="Colleges List"
                right={
                    <button
                        onClick={onRefresh}
                        disabled={loadingList}
                        style={{
                            padding: "9px 12px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: loadingList ? "not-allowed" : "pointer",
                            fontWeight: 600,
                        }}
                    >
                        {loadingList ? "Refreshing..." : "Refresh"}
                    </button>
                }
            >
                <div style={{ display: "grid", gap: 10 }}>
                    <div>
                        <div style={labelStyle}>Select college</div>
                        <select value={selectedId} onChange={onSelect} style={inputStyle}>
                            <option value="">— Select —</option>
                            {colleges.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} • {c.code} ({c.slug})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ fontSize: 13, color: "#666" }}>
                        Total: <b>{colleges.length}</b>
                    </div>

                    <div
                        style={{
                            borderTop: "1px solid #eee",
                            paddingTop: 12,
                            display: "grid",
                            gap: 10,
                        }}
                    >
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Quick actions</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <button
                                onClick={onGetById}
                                disabled={!selectedId || loadingGet}
                                style={{
                                    padding: "9px 12px",
                                    borderRadius: 10,
                                    border: "1px solid #ddd",
                                    background: "#fff",
                                    cursor: !selectedId || loadingGet ? "not-allowed" : "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                {loadingGet ? "Loading..." : "Get By Id"}
                            </button>

                            <button
                                onClick={onDelete}
                                disabled={!selectedId || deletingId === selectedId}
                                style={{
                                    padding: "9px 12px",
                                    borderRadius: 10,
                                    border: "1px solid #f0c0c0",
                                    background: "#fff",
                                    cursor:
                                        !selectedId || deletingId === selectedId
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight: 700,
                                    color: "#b42318",
                                }}
                            >
                                {deletingId === selectedId ? "Deleting..." : "Delete Selected"}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
);

const CollegeDetails = React.memo(({ collegeDetails, loadingGet, selectedId }) => {
    if (!selectedId) {
        return (
            <Card title="College Details (GET /get/:id)">
                <div style={{ fontSize: 13, color: "#666" }}>
                    Select a college to view details.
                </div>
            </Card>
        );
    }

    if (loadingGet) {
        return (
            <Card title="College Details (GET /get/:id)">
                <div style={{ fontSize: 13, color: "#666" }}>Loading details...</div>
            </Card>
        );
    }

    if (!collegeDetails) {
        return (
            <Card title="College Details (GET /get/:id)">
                <div style={{ fontSize: 13, color: "#666" }}>No details available.</div>
            </Card>
        );
    }

    return (
        <Card title="College Details (GET /get/:id)">
            <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 13, color: "#444" }}>
                    <b>ID:</b> <code>{collegeDetails._id}</code>
                </div>

                <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                    <div>
                        <b>Code:</b> {collegeDetails.code}
                    </div>
                    <div>
                        <b>Name:</b> {collegeDetails.name}
                    </div>
                    <div>
                        <b>Slug:</b> {collegeDetails.slug}
                    </div>
                    <div>
                        <b>Short:</b> {collegeDetails.shortName || "—"}
                    </div>
                    <div>
                        <b>Location:</b>{" "}
                        {[collegeDetails.city, collegeDetails.state, collegeDetails.country]
                            .filter(Boolean)
                            .join(", ") || "—"}
                    </div>
                    <div>
                        <b>Active:</b> {collegeDetails.isActive ? "Yes" : "No"}
                    </div>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Images (URL-only)</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ width: 220 }}>
                            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                                Logo
                            </div>
                            {collegeDetails.logoUrl ? (
                                <img
                                    src={collegeDetails.logoUrl}
                                    alt="logo"
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        objectFit: "contain",
                                        background: "#fafafa",
                                        border: "1px solid #eee",
                                        borderRadius: 12,
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        background: "#fafafa",
                                        border: "1px dashed #ddd",
                                        borderRadius: 12,
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#777",
                                        fontSize: 12,
                                    }}
                                >
                                    No logoUrl
                                </div>
                            )}
                        </div>

                        <div style={{ width: 320 }}>
                            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                                Banner
                            </div>
                            {collegeDetails.imageUrl ? (
                                <img
                                    src={collegeDetails.imageUrl}
                                    alt="banner"
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        objectFit: "cover",
                                        background: "#fafafa",
                                        border: "1px solid #eee",
                                        borderRadius: 12,
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        background: "#fafafa",
                                        border: "1px dashed #ddd",
                                        borderRadius: 12,
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#777",
                                        fontSize: 12,
                                    }}
                                >
                                    No imageUrl
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ fontSize: 12, color: "#666" }}>
                    Updated: {new Date(collegeDetails.updatedAt).toLocaleString()}
                </div>
            </div>
        </Card>
    );
});

const AddCollegeForm = React.memo(
    ({ formData, adding, onChange, onFileChange, onSubmit }) => {
        const labelStyle = { fontSize: 12, color: "#333", marginBottom: 6 };
        const inputStyle = {
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
            fontSize: 14,
        };

        const handleInputChange = useCallback(
            (field) => (e) => {
                onChange(field, e.target.value);
            },
            [onChange]
        );

        const handleFileChange = useCallback(
            (field) => (e) => {
                onFileChange(field, e.target.files?.[0] || null);
            },
            [onFileChange]
        );

        return (
            <Card title="Add College (POST /add)">
                <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>Code * (unique)</div>
                            <input
                                style={inputStyle}
                                value={formData.code}
                                onChange={handleInputChange("code")}
                                placeholder="AMITY_NOIDA"
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>Slug * (unique)</div>
                            <input
                                style={inputStyle}
                                value={formData.slug}
                                onChange={handleInputChange("slug")}
                                placeholder="amity"
                            />
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Name *</div>
                        <input
                            style={inputStyle}
                            value={formData.name}
                            onChange={handleInputChange("name")}
                            placeholder="Amity University"
                        />
                    </div>

                    <div>
                        <div style={labelStyle}>Short Name</div>
                        <input
                            style={inputStyle}
                            value={formData.shortName}
                            onChange={handleInputChange("shortName")}
                            placeholder="Amity"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>City</div>
                            <input
                                style={inputStyle}
                                value={formData.city}
                                onChange={handleInputChange("city")}
                                placeholder="Noida"
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>State</div>
                            <input
                                style={inputStyle}
                                value={formData.state}
                                onChange={handleInputChange("state")}
                                placeholder="Uttar Pradesh"
                            />
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Country</div>
                        <input
                            style={inputStyle}
                            value={formData.country}
                            onChange={handleInputChange("country")}
                            placeholder="India"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>Logo file (optional)</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange("logo")}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>Banner image file (optional)</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange("image")}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={adding}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #111",
                            background: "#111",
                            color: "#fff",
                            fontWeight: 800,
                            cursor: adding ? "not-allowed" : "pointer",
                        }}
                    >
                        {adding ? "Adding..." : "Add College"}
                    </button>

                    <div style={{ fontSize: 12, color: "#666" }}>
                        Required: <code>code</code>, <code>name</code>, <code>slug</code>. Files:{" "}
                        <code>logo</code>, <code>image</code> (optional).
                    </div>
                </form>
            </Card>
        );
    }
);

const UpdateCollegeForm = React.memo(
    ({ selectedId, formData, updating, onChange, onFileChange, onSubmit }) => {
        const labelStyle = { fontSize: 12, color: "#333", marginBottom: 6 };
        const inputStyle = {
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            outline: "none",
            fontSize: 14,
        };

        const handleInputChange = useCallback(
            (field) => (e) => {
                const value = field === "isActive" ? e.target.checked : e.target.value;
                onChange(field, value);
            },
            [onChange]
        );

        const handleFileChange = useCallback(
            (field) => (e) => {
                onFileChange(field, e.target.files?.[0] || null);
            },
            [onFileChange]
        );

        return (
            <Card title="Update College (PUT /update/:id)">
                <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>
                    Select a college from the list. This form auto-fills from GET by id.
                </div>

                <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                    <div>
                        <div style={labelStyle}>Selected ID</div>
                        <input style={inputStyle} value={selectedId} readOnly placeholder="Select a college" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>Code</div>
                            <input
                                style={inputStyle}
                                value={formData.code}
                                onChange={handleInputChange("code")}
                                placeholder="AMITY_NOIDA"
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>Slug</div>
                            <input
                                style={inputStyle}
                                value={formData.slug}
                                onChange={handleInputChange("slug")}
                                placeholder="amity"
                            />
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Name</div>
                        <input style={inputStyle} value={formData.name} onChange={handleInputChange("name")} />
                    </div>

                    <div>
                        <div style={labelStyle}>Short Name</div>
                        <input
                            style={inputStyle}
                            value={formData.shortName}
                            onChange={handleInputChange("shortName")}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>City</div>
                            <input style={inputStyle} value={formData.city} onChange={handleInputChange("city")} />
                        </div>
                        <div>
                            <div style={labelStyle}>State</div>
                            <input style={inputStyle} value={formData.state} onChange={handleInputChange("state")} />
                        </div>
                    </div>

                    <div>
                        <div style={labelStyle}>Country</div>
                        <input
                            style={inputStyle}
                            value={formData.country}
                            onChange={handleInputChange("country")}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={handleInputChange("isActive")}
                        />
                        <label htmlFor="isActive" style={{ fontSize: 13 }}>
                            isActive
                        </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <div style={labelStyle}>New logo file (optional)</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange("logo")}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <div style={labelStyle}>New banner file (optional)</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange("image")}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={updating || !selectedId}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid #111",
                            background: selectedId ? "#111" : "#777",
                            color: "#fff",
                            fontWeight: 800,
                            cursor: updating || !selectedId ? "not-allowed" : "pointer",
                        }}
                    >
                        {updating ? "Updating..." : "Update College"}
                    </button>
                </form>
            </Card>
        );
    }
);

const CollegeApiTestPage = () => {
    // list + selection
    const [colleges, setColleges] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [selectedId, setSelectedId] = useState("");

    // fetch-by-id
    const [loadingGet, setLoadingGet] = useState(false);
    const [collegeDetails, setCollegeDetails] = useState(null);

    // add form
    const [addForm, setAddForm] = useState({
        code: "",
        name: "",
        shortName: "",
        slug: "",
        city: "",
        state: "",
        country: "India",
    });
    const [addFiles, setAddFiles] = useState({ logo: null, image: null });
    const [adding, setAdding] = useState(false);

    // update form
    const [updateForm, setUpdateForm] = useState({
        code: "",
        name: "",
        shortName: "",
        slug: "",
        city: "",
        state: "",
        country: "India",
        isActive: true,
    });
    const [updateFiles, setUpdateFiles] = useState({ logo: null, image: null });
    const [updating, setUpdating] = useState(false);

    // delete
    const [deletingId, setDeletingId] = useState("");

    // UI messages
    const [message, setMessage] = useState({ type: "", text: "" });

    const axiosClient = useMemo(() => {
        return axios.create({
            baseURL: API_BASE,
            withCredentials: false,
            timeout: 20000,
        });
    }, []);

    const showMsg = useCallback((type, text) => setMessage({ type, text }), []);
    const resetMsg = useCallback(() => setMessage({ type: "", text: "" }), []);

    const fetchColleges = useCallback(async () => {
        resetMsg();
        setLoadingList(true);
        try {
            const res = await axiosClient.get("/api/college/list");
            if (res.data?.success) setColleges(res.data.colleges || []);
            else showMsg("error", res.data?.message || "Failed to fetch colleges");
        } catch (err) {
            showMsg("error", err?.response?.data?.message || err.message);
        } finally {
            setLoadingList(false);
        }
    }, [axiosClient, showMsg, resetMsg]);

    const fetchCollegeById = useCallback(
        async (id) => {
            if (!id) return;
            resetMsg();
            setLoadingGet(true);
            setCollegeDetails(null);
            try {
                const res = await axiosClient.get(`/api/college/get/${id}`);
                if (res.data?.success) {
                    const c = res.data.college;
                    setCollegeDetails(c);

                    // prefill update form (include code now)
                    setUpdateForm({
                        code: c?.code || "",
                        name: c?.name || "",
                        shortName: c?.shortName || "",
                        slug: c?.slug || "",
                        city: c?.city || "",
                        state: c?.state || "",
                        country: c?.country || "India",
                        isActive: Boolean(c?.isActive),
                    });
                } else {
                    showMsg("error", res.data?.message || "College not found");
                }
            } catch (err) {
                showMsg("error", err?.response?.data?.message || err.message);
            } finally {
                setLoadingGet(false);
            }
        },
        [axiosClient, showMsg, resetMsg]
    );

    const buildFormData = useCallback((fields, logoFile, imageFile) => {
        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
            if (v === undefined || v === null) return;
            if (typeof v === "boolean") fd.append(k, v ? "true" : "false");
            else fd.append(k, v);
        });
        if (logoFile) fd.append("logo", logoFile);
        if (imageFile) fd.append("image", imageFile);
        return fd;
    }, []);

    const handleAddFormChange = useCallback((field, value) => {
        setAddForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleAddFileChange = useCallback((field, file) => {
        setAddFiles((prev) => ({ ...prev, [field]: file }));
    }, []);

    const handleUpdateFormChange = useCallback((field, value) => {
        setUpdateForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleUpdateFileChange = useCallback((field, file) => {
        setUpdateFiles((prev) => ({ ...prev, [field]: file }));
    }, []);

    const addCollege = useCallback(
        async (e) => {
            e.preventDefault();
            resetMsg();

            // Basic client-side check (backend will also check)
            if (!addForm.code || !addForm.name || !addForm.slug) {
                showMsg("error", "Please fill required fields: code, name, slug");
                return;
            }

            setAdding(true);
            try {
                const fd = buildFormData(addForm, addFiles.logo, addFiles.image);
                const res = await axiosClient.post("/api/college/add", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data?.success) {
                    showMsg("success", "College added successfully");
                    setAddForm({
                        code: "",
                        name: "",
                        shortName: "",
                        slug: "",
                        city: "",
                        state: "",
                        country: "India",
                    });
                    setAddFiles({ logo: null, image: null });
                    await fetchColleges();
                } else {
                    showMsg("error", res.data?.message || "Failed to add college");
                }
            } catch (err) {
                showMsg("error", err?.response?.data?.message || err.message);
            } finally {
                setAdding(false);
            }
        },
        [addForm, addFiles, axiosClient, buildFormData, fetchColleges, resetMsg, showMsg]
    );

    const updateCollege = useCallback(
        async (e) => {
            e.preventDefault();
            if (!selectedId) {
                showMsg("error", "Select a college first to update.");
                return;
            }
            resetMsg();
            setUpdating(true);
            try {
                const fd = buildFormData(updateForm, updateFiles.logo, updateFiles.image);
                const res = await axiosClient.put(`/api/college/update/${selectedId}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data?.success) {
                    showMsg("success", "College updated successfully");
                    setUpdateFiles({ logo: null, image: null });
                    await fetchColleges();
                    await fetchCollegeById(selectedId);
                } else {
                    showMsg("error", res.data?.message || "Failed to update college");
                }
            } catch (err) {
                showMsg("error", err?.response?.data?.message || err.message);
            } finally {
                setUpdating(false);
            }
        },
        [
            selectedId,
            updateForm,
            updateFiles,
            axiosClient,
            buildFormData,
            fetchColleges,
            fetchCollegeById,
            resetMsg,
            showMsg,
        ]
    );

    const deleteCollege = useCallback(
        async (id) => {
            if (!id) return;
            resetMsg();
            setDeletingId(id);
            try {
                const res = await axiosClient.delete(`/api/college/remove/${id}`);
                if (res.data?.success) {
                    showMsg("success", "College removed successfully");
                    if (selectedId === id) {
                        setSelectedId("");
                        setCollegeDetails(null);
                    }
                    await fetchColleges();
                } else {
                    showMsg("error", res.data?.message || "Failed to remove college");
                }
            } catch (err) {
                showMsg("error", err?.response?.data?.message || err.message);
            } finally {
                setDeletingId("");
            }
        },
        [selectedId, axiosClient, fetchColleges, resetMsg, showMsg]
    );

    const handleSelectCollege = useCallback((e) => {
        setSelectedId(e.target.value);
    }, []);

    const handleGetById = useCallback(() => {
        if (selectedId) fetchCollegeById(selectedId);
    }, [selectedId, fetchCollegeById]);

    const handleDeleteSelected = useCallback(() => {
        if (selectedId) deleteCollege(selectedId);
    }, [selectedId, deleteCollege]);

    useEffect(() => {
        fetchColleges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedId) fetchCollegeById(selectedId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId]);

    return (
        <div style={{ padding: 18, background: "#f7f7f8", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>UniTrade — College API Tester</div>
                    <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
                        Backend: <code>{COLLEGES_API}</code>
                    </div>
                </div>

                <MsgBar message={message} onClose={resetMsg} />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                        alignItems: "start",
                    }}
                >
                    {/* LEFT: List + Details */}
                    <div style={{ display: "grid", gap: 14 }}>
                        <CollegeList
                            colleges={colleges}
                            selectedId={selectedId}
                            loadingList={loadingList}
                            loadingGet={loadingGet}
                            deletingId={deletingId}
                            onSelect={handleSelectCollege}
                            onRefresh={fetchColleges}
                            onGetById={handleGetById}
                            onDelete={handleDeleteSelected}
                        />

                        <CollegeDetails
                            collegeDetails={collegeDetails}
                            loadingGet={loadingGet}
                            selectedId={selectedId}
                        />
                    </div>

                    {/* RIGHT: Add + Update */}
                    <div style={{ display: "grid", gap: 14 }}>
                        <AddCollegeForm
                            formData={addForm}
                            adding={adding}
                            onChange={handleAddFormChange}
                            onFileChange={handleAddFileChange}
                            onSubmit={addCollege}
                        />

                        <UpdateCollegeForm
                            selectedId={selectedId}
                            formData={updateForm}
                            updating={updating}
                            onChange={handleUpdateFormChange}
                            onFileChange={handleUpdateFileChange}
                            onSubmit={updateCollege}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeApiTestPage;
