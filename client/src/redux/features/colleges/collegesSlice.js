import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../../api/http";

export const fetchColleges = createAsyncThunk("colleges/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await http.get("/api/college/list");
        if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to fetch colleges");
        return res.data.colleges || [];
    } catch (e) {
        return rejectWithValue(e?.response?.data?.message || e.message);
    }
});

const collegesSlice = createSlice({
    name: "colleges",
    initialState: { list: [], status: "idle", error: null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchColleges.pending, (s) => { s.status = "loading"; s.error = null; });
        b.addCase(fetchColleges.fulfilled, (s, a) => { s.status = "succeeded"; s.list = a.payload; });
        b.addCase(fetchColleges.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
    },
});

export default collegesSlice.reducer;
