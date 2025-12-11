import React from "react";
import { useSelector } from "react-redux";

export default function AuthForm({ username, setUsername, password, setPassword, isRegister, onSubmit, disabled }) {

    const rateLimitUntil = useSelector(state => state.auth.rateLimitUntil);
    const isRateLimited = Boolean(rateLimitUntil && Date.now() < rateLimitUntil);

    return (
        <form onSubmit={onSubmit} className="auth-form">
            <div className="field">
                <label>Имя пользователя</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    type="text"
                    autoComplete="username"
                />
            </div>

            <div className="field">
                <label>Пароль</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                />
            </div>

            <div className="actions">
                <button type="submit" className="btn primary" disabled={disabled || isRateLimited}>
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                </button>
            </div>

            {isRateLimited && (
                <div className="message warning">
                    Вы временно заблокированы. Подожди немного и попробуй снова.
                </div>
            )}
        </form>
    );
}
