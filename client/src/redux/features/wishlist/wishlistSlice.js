import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../../api/http";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await http.get("/api/wishlist");
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to fetch wishlist");
        return res.data.wishlist || res.data.items || [];
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

export const addToWishlist = createAsyncThunk("wishlist/add", async (itemId, { rejectWithValue }) => {
    try {
        const res = await http.post(`/api/wishlist/add/${itemId}`);
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to add to wishlist");
        return itemId; // we’ll refetch for simplicity
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (itemId, { rejectWithValue }) => {
    try {
        const res = await http.delete(`/api/wishlist/remove/${itemId}`);
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to remove from wishlist");
        return itemId; // we’ll refetch for simplicity
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: { items: [], status: "idle", error: null, updatingId: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchWishlist.pending, (s) => { s.status = "loading"; s.error = null; });
        b.addCase(fetchWishlist.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; });
        b.addCase(fetchWishlist.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });

        b.addCase(addToWishlist.pending, (s, a) => { s.updatingId = a.meta.arg; });
        b.addCase(addToWishlist.fulfilled, (s) => { s.updatingId = null; });
        b.addCase(addToWishlist.rejected, (s, a) => { s.updatingId = null; s.error = a.payload; });

        b.addCase(removeFromWishlist.pending, (s, a) => { s.updatingId = a.meta.arg; });
        b.addCase(removeFromWishlist.fulfilled, (s) => { s.updatingId = null; });
        b.addCase(removeFromWishlist.rejected, (s, a) => { s.updatingId = null; s.error = a.payload; });
    },
});

export default wishlistSlice.reducer;
