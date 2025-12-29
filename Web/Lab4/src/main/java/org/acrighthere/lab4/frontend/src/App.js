import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage";
import './App.css'
import { setCredentials, logout } from "./store/authSlice";
import api from "./api";
import axios from "axios";

function App() {
    const dispatch = useDispatch();
    const reduxToken = useSelector(state => state.auth.accessToken);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const response = await axios.get("http://localhost:8080/api/auth/verify", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        timeout: 5000
                    });
                    if (response.status === 200) {
                        dispatch(setCredentials({ user: { username: "User" }, accessToken: token, refreshToken: null }));
                    }
                } catch (error) {
                    localStorage.removeItem("accessToken");
                    dispatch(logout());
                }
            }
            setChecking(false);
        };

        validateToken();
    }, [dispatch]);

    const isLoggedIn = !!reduxToken;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        dispatch(logout());
    };

    if (checking) return <div>Проверка авторизации...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <AuthPage />} />
                <Route path="/home" element={isLoggedIn ? <MainPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />} />
            </Routes>
        </Router>
    );
}

export default App;
