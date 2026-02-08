import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice"
import collegesReducer from "./features/colleges/collegesSlice";
import itemsReducer from "./features/items/itemsSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        colleges: collegesReducer,
        items: itemsReducer,
        wishlist: wishlistReducer,
    },
});
