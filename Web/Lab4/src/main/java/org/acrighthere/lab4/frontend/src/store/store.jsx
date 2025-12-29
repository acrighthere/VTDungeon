import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import pointsReducer from "./pointsSlice";
import coordsReducer from "./coordsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        points: pointsReducer,
        coords: coordsReducer,
    },
});

export default store;
