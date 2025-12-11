import { createSlice } from "@reduxjs/toolkit";

const coordsSlice = createSlice({
    name: "coords",
    initialState: { x: null, y: null, r: null },
    reducers: {
        setCoords: (state, action) => {
            const { x, y, r } = action.payload;
            state.x = x;
            state.y = y;
            state.r = r;
        },
        setCoordsFromCanvas: (state, action) => {
            const { x, y } = action.payload;
            state.x = x;
            state.y = y;
        }
    }
});

export const { setCoords, setCoordsFromCanvas } = coordsSlice.actions;
export default coordsSlice.reducer;
