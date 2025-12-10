import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import api from "../api";
import AuthForm from "../components/AuthForm";

export default function AuthPage() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegister) {
                await api.post("/auth/register", { username, password });
                setMessage("Регистрация успешна! Теперь войдите в систему.");
                setIsRegister(false);
            } else {
                const res = await api.post("/auth/login", { username, password });
                const { accessToken } = res.data;

                localStorage.setItem("accessToken", accessToken);
                dispatch(setCredentials({ user: { username }, accessToken, refreshToken: null }));
                setMessage("Вход выполнен успешно!");
                window.location.href = "/";
            }
        } catch (err) {
            setMessage(err.response?.data?.error || "Ошибка сервера");
        }
    };

    return (
        <div className="auth-page">
            <header>
                <h1>Родионов Максим, P3231, Вариант 4467</h1>
            </header>
            <AuthForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                isRegister={isRegister}
                onSubmit={handleSubmit}
            />
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Перейти к входу" : "Создать аккаунт"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
