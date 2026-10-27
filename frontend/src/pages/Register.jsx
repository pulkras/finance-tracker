import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function getRegistrationError(error) {
  const data = error.response?.data;

  if (!data) {
    return "Не удалось подключиться к серверу.";
  }

  if (typeof data === "string") {
    return data;
  }

  const messages = Object.values(data)
    .flat()
    .filter((message) => typeof message === "string");

  return messages[0] || "Не удалось зарегистрироваться.";
}

export default function Register() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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

    if (password !== passwordConfirm) {
      setError("Пароли не совпадают.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      navigate("/", { replace: true });
    } catch (err) {
      setError(getRegistrationError(err));
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

        <h1>Создай аккаунт</h1>

        <p className="auth-subtitle">
          Начни управлять личным бюджетом.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="username">Имя пользователя</label>

          <input
            id="username"
            type="text"
            autoComplete="username"
            minLength={1}
            maxLength={150}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Например, alex"
            required
          />

          <label htmlFor="email">Электронная почта</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@example.com"
            required
          />

          <label htmlFor="password">Пароль</label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Придумай пароль"
            required
          />

          <label htmlFor="password-confirm">Повтори пароль</label>

          <input
            id="password-confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="Повтори пароль"
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
            {submitting ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-footer">
          Уже есть аккаунт?{" "}
          <Link to="/login">Войти</Link>
        </div>
      </section>
    </main>
  );
}
