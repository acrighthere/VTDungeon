import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api";
import { fetchPoints, setPage } from "../../store/pointsSlice";

export default function ClearButton() {
    const dispatch = useDispatch();
    const pageSize = useSelector(state => state.points.pageSize);

    const handleClear = async () => {
        try {
            await api.delete("/points/clear");

            dispatch(setPage(0));
            dispatch(fetchPoints({ page: 0, size: pageSize }));
        } catch (err) {
            console.error("Ошибка при очистке точек:", err);
            alert("Не удалось очистить точки");
        }
    };

    return (
        <button className="btn secondary" onClick={handleClear}>
            Очистить
        </button>
    );
}
