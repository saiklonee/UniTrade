import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../../api/http";

export const fetchFeedItems = createAsyncThunk(
    "items/fetchFeed",
    async ({ collegeId, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const res = await http.get("/api/item/list", {
                params: { college: collegeId, page, limit, status: "available" },
            });
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to fetch items");
            return res.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    }
);

export const fetchItemById = createAsyncThunk(
    "items/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await http.get(`/api/item/get/${id}`);
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to fetch item");
            return res.data.item;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    }
);

const itemsSlice = createSlice({
    name: "items",
    initialState: {
        feed: [],
        feedMeta: { page: 1, pages: 1, total: 0, limit: 20 },
        feedStatus: "idle",
        feedError: null,

        itemById: {},
        itemStatus: "idle",
        itemError: null,
    },
    reducers: {
        clearFeed(state) {
            state.feed = [];
            state.feedMeta = { page: 1, pages: 1, total: 0, limit: 20 };
            state.feedStatus = "idle";
            state.feedError = null;
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchFeedItems.pending, (s) => { s.feedStatus = "loading"; s.feedError = null; });
        b.addCase(fetchFeedItems.fulfilled, (s, a) => {
            s.feedStatus = "succeeded";
            s.feed = a.payload.items || [];
            s.feedMeta = {
                page: a.payload.page,
                pages: a.payload.pages,
                total: a.payload.total,
                limit: a.payload.limit,
            };
        });
        b.addCase(fetchFeedItems.rejected, (s, a) => { s.feedStatus = "failed"; s.feedError = a.payload; });

        b.addCase(fetchItemById.pending, (s) => { s.itemStatus = "loading"; s.itemError = null; });
        b.addCase(fetchItemById.fulfilled, (s, a) => {
            s.itemStatus = "succeeded";
            s.itemById[a.payload._id] = a.payload;
        });
        b.addCase(fetchItemById.rejected, (s, a) => { s.itemStatus = "failed"; s.itemError = a.payload; });
    },
});

export const { clearFeed } = itemsSlice.actions;
export default itemsSlice.reducer;
