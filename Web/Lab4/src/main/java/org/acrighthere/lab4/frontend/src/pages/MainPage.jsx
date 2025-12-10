import React, { useEffect } from "react";
import '../styles/MainPage.css';
import { useNavigate } from "react-router-dom";

export default function MainPage({ onLogout }) {
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === "accessToken" && !e.newValue) {
                navigate("/login", { replace: true });
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [navigate]);

    return (
        <div className="main-page">
            <div className="main-card">
                <h1>Добро пожаловать!</h1>
                <p>Это ваша основная страница.</p>
                <button className="btn primary" onClick={onLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
}
