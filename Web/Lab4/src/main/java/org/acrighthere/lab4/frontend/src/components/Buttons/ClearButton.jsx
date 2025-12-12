import React from "react";
import { useDispatch } from "react-redux";
import api from "../../api";
import { fetchPoints } from "../../store/pointsSlice";

export default function ClearButton() {
    const dispatch = useDispatch();

    const handleClear = async () => {
        try {
            await api.delete("/points/clear");
            dispatch(fetchPoints());
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
