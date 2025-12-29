import React from "react";
import { useDispatch } from "react-redux";
import { resetPoints } from "../../store/pointsSlice";


export default function LogoutButton({ onLogout }) {
    const dispatch = useDispatch();

    const handleLogout = () => {
        if (onLogout) onLogout();
        dispatch(resetPoints());
    };

    return (
        <button className="logout-btn" onClick={handleLogout}>
            Выйти
        </button>
    );
}
