import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Получение всех точек
export const fetchPoints = createAsyncThunk(
    "points/fetchPoints",
    async (_, thunkAPI) => {
        try {
            const res = await api.get("/points");
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Ошибка загрузки точек");
        }
    }
);

// Отправка точки на проверку
export const sendPoint = createAsyncThunk(
    "points/sendPoint",
    async ({ x, y, r }, thunkAPI) => {
        try {
            const res = await api.post("/points/add", null, { params: { x, y, r } });
            return res.data;
        } catch (err) {
            if (err.response && err.response.status === 429) {
                const retryAfter = err.response.data.retryAfter || 60;
                return thunkAPI.rejectWithValue(`Слишком часто! Подождите ${retryAfter} секунд`);
            }
            return thunkAPI.rejectWithValue("Ошибка отправки точки");
        }
    }
);

const pointsSlice = createSlice({
    name: "points",
    initialState: {
        items: [],
        loading: false,
        error: null,
        currentPage: 1,
        pageSize: 5
    },
    reducers: {
        resetPoints: state => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.currentPage = 1;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.currentPage = 1;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchPoints.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
            })
            .addCase(fetchPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendPoint.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendPoint.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(sendPoint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetPoints, setPage, setPageSize } = pointsSlice.actions;
export default pointsSlice.reducer;
