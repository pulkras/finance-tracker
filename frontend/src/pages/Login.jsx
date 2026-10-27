import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="auth-loading">Проверяем авторизацию...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login({
        username: username.trim(),
        password,
      });

      navigate("/", { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Неверное имя пользователя или пароль.");
      } else {
        setError(
          "Не удалось войти. Проверь соединение с сервером."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-icon">
          <Wallet size={27} />
        </div>

        <h1>С возвращением!</h1>

        <p className="auth-subtitle">
          Войди, чтобы управлять своими финансами.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Имя пользователя</label>

          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Твоё имя пользователя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Пароль</label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Введи пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button button-primary auth-submit"
            disabled={submitting}
          >
            {submitting ? "Входим..." : "Войти"}
          </button>
        </form>

        <div className="auth-footer">
          Ещё нет аккаунта?{" "}
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </section>
    </main>
  );
}
