import React from "react";

export default function AuthForm({
                                     username,
                                     setUsername,
                                     password,
                                     setPassword,
                                     isRegister,
                                     onSubmit
                                 }) {
    return (
        <form className="auth-card__form" onSubmit={onSubmit}>
            <label className="input-group">
                <span className="input-label">Логин</span>
                <input
                    className="input-field"
                    type="text"
                    placeholder="Введите логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>

            <label className="input-group">
                <span className="input-label">Пароль</span>
                <input
                    className="input-field"
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button className="btn primary" type="submit">
                {isRegister ? "Зарегистрироваться" : "Войти"}
            </button>
        </form>
    );
}
