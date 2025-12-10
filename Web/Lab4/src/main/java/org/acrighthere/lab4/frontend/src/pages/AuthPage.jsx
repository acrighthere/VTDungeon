import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import api from "../api";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isRegister) {
                await api.post("/auth/register", { username, password });
                setMessage("Регистрация успешна — войдите в систему.");
                setIsRegister(false);
                setLoading(false);
                return;
            }

            const res = await api.post("/auth/login", { username, password });
            const { accessToken } = res.data;

            localStorage.setItem("accessToken", accessToken);
            dispatch(setCredentials({ user: { username }, accessToken, refreshToken: null }));

            navigate("/", { replace: true });
        } catch (err) {
            setMessage(err.response?.data?.error || "Ошибка сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h1 className="brand">Родионов Максим — P3231</h1>
                    <p className="subtitle">Вариант 4467</p>
                </div>

                <AuthForm
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    isRegister={isRegister}
                    onSubmit={handleSubmit}
                    disabled={loading}
                />

                <div className="auth-card__footer">
                    <button
                        className="btn ghost"
                        onClick={() => { setIsRegister(!isRegister); setMessage(""); }}
                        type="button"
                        disabled={loading}
                    >
                        {isRegister ? "Вернуться к входу" : "Создать аккаунт"}
                    </button>

                    {message && <div className="message">{message}</div>}
                    {loading && <div className="message">Проверка...</div>}
                </div>
            </div>
        </div>
    );
}
