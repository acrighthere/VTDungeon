import React from "react";

export default function AuthForm({ username, setUsername, password, setPassword, isRegister, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
        </form>
    );
}