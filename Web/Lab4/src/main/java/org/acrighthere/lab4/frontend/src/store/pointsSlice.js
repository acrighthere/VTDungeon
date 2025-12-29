import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Загрузка страницы точек (серверная пагинация)
export const fetchPoints = createAsyncThunk(
    "points/fetchPoints",
    async ({ page = 0, size = 5 }, thunkAPI) => {
        try {
            const res = await api.get("/points", { params: { page, size } });
            return {
                points: res.data.content,
                currentPage: res.data.number,
                totalPages: res.data.totalPages
            };
        } catch (err) {
            return thunkAPI.rejectWithValue("Ошибка загрузки точек");
        }
    }
);

// Отправка точки
export const sendPoint = createAsyncThunk(
    "points/sendPoint",
    async ({ x, y, r }, thunkAPI) => {
        try {
            const res = await api.post("/points/add", null, {
                params: { x, y, r }
            });
            return res.data;
        } catch (err) {
            if (err.response && err.response.status === 429) {
                const retryAfter = err.response.data.retryAfter || 60;
                return thunkAPI.rejectWithValue(
                    `Слишком часто! Подождите ${retryAfter} секунд`
                );
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
        currentPage: 0,
        totalPages: 0,
        pageSize: 5
    },
    reducers: {
        setPage(state, action) {
            state.currentPage = action.payload;
        },
        setPageSize(state, action) {
            state.pageSize = action.payload;
            state.currentPage = 0;
        },
        resetPoints(state) {
            state.items = [];
            state.currentPage = 0;
            state.totalPages = 0;
            state.loading = false;
            state.error = null;
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
                state.items = action.payload.points;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendPoint.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendPoint.fulfilled, state => {
                state.loading = false;
                state.currentPage = 0; // ВАЖНО
            })
            .addCase(sendPoint.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setPage, setPageSize, resetPoints } = pointsSlice.actions;
export default pointsSlice.reducer;
