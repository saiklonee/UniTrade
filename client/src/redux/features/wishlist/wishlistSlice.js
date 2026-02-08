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

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: { items: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchWishlist.pending, (s) => { s.status = "loading"; s.error = null; });
        b.addCase(fetchWishlist.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; });
        b.addCase(fetchWishlist.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
    },
});

export default wishlistSlice.reducer;
