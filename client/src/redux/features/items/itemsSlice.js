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

export const fetchMyItems = createAsyncThunk(
    "items/fetchMyItems",
    async ({ status, isActive }, { rejectWithValue }) => {
        try {
            const params = {};
            if (status) params.status = status;
            if (isActive !== undefined) params.isActive = isActive;
            const res = await http.get("/api/item/my-items", { params });
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to fetch your items");
            return res.data.items;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    }
);

export const deleteItem = createAsyncThunk(
    "items/deleteItem",
    async (id, { rejectWithValue }) => {
        try {
            const res = await http.delete(`/api/item/remove/${id}`);
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to delete item");
            return id;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    }
);

export const updateItem = createAsyncThunk(
    "items/updateItem",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const isFormData = data instanceof FormData;
            const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
            const res = await http.put(`/api/item/update/${id}`, data, { headers });
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to update item");
            return res.data.item;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    }
);

export const toggleItemActive = createAsyncThunk(
    "items/toggleItemActive",
    async ({ id, isActive }, { rejectWithValue }) => {
        try {
            const res = await http.patch(`/api/item/toggle-active/${id}`, { isActive });
            if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to toggle item");
            return { id, isActive: res.data.isActive };
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

        myItems: [],
        myItemsStatus: "idle",
        myItemsError: null,
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

        // My Items
        b.addCase(fetchMyItems.pending, (s) => { s.myItemsStatus = "loading"; s.myItemsError = null; });
        b.addCase(fetchMyItems.fulfilled, (s, a) => {
            s.myItemsStatus = "succeeded";
            s.myItems = a.payload;
        });
        b.addCase(fetchMyItems.rejected, (s, a) => { s.myItemsStatus = "failed"; s.myItemsError = a.payload; });

        // Delete Item
        b.addCase(deleteItem.fulfilled, (s, a) => {
            s.myItems = s.myItems.filter(i => i._id !== a.payload);
        });

        // Update Item
        b.addCase(updateItem.fulfilled, (s, a) => {
            const index = s.myItems.findIndex(i => i._id === a.payload._id);
            if (index !== -1) s.myItems[index] = a.payload;
            // Also update itemById if it exists
            if (s.itemById[a.payload._id]) s.itemById[a.payload._id] = a.payload;
        });

        // Toggle Active
        b.addCase(toggleItemActive.fulfilled, (s, a) => {
            const index = s.myItems.findIndex(i => i._id === a.payload.id);
            if (index !== -1) s.myItems[index].isActive = a.payload.isActive;
            // Also update itemById if it exists
            if (s.itemById[a.payload.id]) s.itemById[a.payload.id].isActive = a.payload.isActive;
        });
    },
});

export const { clearFeed } = itemsSlice.actions;
export default itemsSlice.reducer;
