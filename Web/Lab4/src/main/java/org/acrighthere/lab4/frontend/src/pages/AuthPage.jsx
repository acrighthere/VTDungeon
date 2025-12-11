import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setRateLimit } from "../store/authSlice";
import api from "../api";
import "../styles/AuthPage.css";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [loading, setLoading] = useState(false);

    const LOGIN_RATE_LIMIT_KEY = "login-rate-limit-until";
    const REGISTER_RATE_LIMIT_KEY = "register-rate-limit-until";

    const rateLimitUntil = useSelector(state => state.auth.rateLimitUntil);

    useEffect(() => {
        const currentKey = isRegister ? REGISTER_RATE_LIMIT_KEY : LOGIN_RATE_LIMIT_KEY;
        const bannedMs = localStorage.getItem(currentKey);
        if (bannedMs && parseInt(bannedMs, 10) > Date.now()) {
            dispatch(setRateLimit(parseInt(bannedMs, 10)));
            startCountdown(parseInt(bannedMs, 10));
        } else {
            dispatch(setRateLimit(null));
            localStorage.removeItem(currentKey);
        }
    }, [isRegister]);

    const startCountdown = useCallback((untilTimestamp) => {
        const update = () => {
            const secondsLeft = Math.max(0, Math.round((untilTimestamp - Date.now()) / 1000));

            if (secondsLeft <= 0) {
                localStorage.removeItem(LOGIN_RATE_LIMIT_KEY);
                localStorage.removeItem(REGISTER_RATE_LIMIT_KEY);
                dispatch(setRateLimit(null));
                setMessage("");
                setMessageType("info");
                return;
            }

            setMessage(`Слишком много попыток! Подожди ${secondsLeft} сек.`);
            setMessageType("warning");

            setTimeout(update, 1000);
        };

        update();
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setMessage("");

        const rateKey = isRegister ? REGISTER_RATE_LIMIT_KEY : LOGIN_RATE_LIMIT_KEY;
        const bannedMs = localStorage.getItem(rateKey);

        if (bannedMs && parseInt(bannedMs, 10) > Date.now()) {
            const secondsLeft = Math.max(0, Math.round((parseInt(bannedMs, 10) - Date.now()) / 1000));
            setMessage(`Слишком много попыток! Подожди ${secondsLeft} сек.`);
            setMessageType("warning");
            setLoading(false);
            dispatch(setRateLimit(parseInt(bannedMs, 10)));
            startCountdown(parseInt(bannedMs, 10));
            return;
        }

        try {
            if (isRegister) {
                await api.post("/auth/register", { username, password });
                setMessage("Регистрация успешна — войдите в систему.");
                setMessageType("info");
                setIsRegister(false);
                return;
            }

            const res = await api.post("/auth/login", { username, password });
            const { accessToken } = res.data;


            localStorage.removeItem(LOGIN_RATE_LIMIT_KEY);
            localStorage.removeItem(REGISTER_RATE_LIMIT_KEY);
            dispatch(setRateLimit(null));

            localStorage.setItem("accessToken", accessToken);
            dispatch(setCredentials({ user: { username }, accessToken, refreshToken: null }));
            navigate("/", { replace: true });

        } catch (err) {
            if (err.isRateLimited) {
                const banUntil = Date.now() + err.retryAfter * 1000;
                localStorage.setItem(rateKey, banUntil.toString());
                dispatch(setRateLimit(banUntil));
                startCountdown(banUntil);
                setMessage(`Слишком много запросов. Подожди ${err.retryAfter} сек.`);
                setMessageType("warning");
            } else {
                const errorMsg = err.response?.data?.error ||
                    err.response?.data?.message ||
                    (isRegister ? "Ошибка регистрации" : "Неверный логин или пароль");
                setMessage(errorMsg);
                setMessageType("error");
            }
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
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setMessage("");

                            const newKey = !isRegister ? REGISTER_RATE_LIMIT_KEY : LOGIN_RATE_LIMIT_KEY;
                            const bannedMs = localStorage.getItem(newKey);
                            if (bannedMs && parseInt(bannedMs, 10) > Date.now()) {
                                dispatch(setRateLimit(parseInt(bannedMs, 10)));
                                startCountdown(parseInt(bannedMs, 10));
                            } else {
                                dispatch(setRateLimit(null));
                            }
                        }}
                        type="button"
                        disabled={loading}
                    >
                        {isRegister ? "Вернуться к входу" : "Создать аккаунт"}
                    </button>

                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
                        </div>
                    )}
                    {loading && <div className="message">Проверка...</div>}
                </div>
            </div>
        </div>
    );
}
