import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../../api/http";


export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    try {
        const res = await http.get("/api/user/is-auth");
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Not authenticated");
        return res.data.user; // user object
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const res = await http.post("/api/user/login", { email, password });
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Login failed");
        // after login, call is-auth to get user (consistent)
        const me = await http.get("/api/user/is-auth");
        if (!me.data?.success) return rejectWithValue("Login ok but cannot fetch user");
        return me.data.user;
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const res = await http.post("/api/user/logout");
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Logout failed");
        return true;
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, { rejectWithValue }) => {
    try {
        const res = await http.patch("/api/user/me", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Update failed");
        return res.data.user;
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        booting: true,      // app boot auth check
        user: null,
        status: "idle",
        error: null,
    },
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (b) => {
        b.addCase(checkAuth.pending, (state) => {
            state.booting = true;
            state.error = null;
        });
        b.addCase(checkAuth.fulfilled, (state, action) => {
            state.booting = false;
            state.user = action.payload;
        });
        b.addCase(checkAuth.rejected, (state) => {
            state.booting = false;
            state.user = null;
        });

        b.addCase(login.pending, (state) => {
            state.status = "loading";
            state.error = null;
        });
        b.addCase(login.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = action.payload;
        });
        b.addCase(login.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload || "Login failed";
        });

        b.addCase(logout.fulfilled, (state) => {
            state.user = null;
        });

        b.addCase(updateProfile.pending, (state) => {
            state.status = "loading";
            state.error = null;
        });
        b.addCase(updateProfile.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.user = action.payload;
        });
        b.addCase(updateProfile.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload || "Update failed";
        });
    },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
