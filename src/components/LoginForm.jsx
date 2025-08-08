import { useState } from "react";
import { login } from "../api/authService";
import { useAuthStore } from "../store/authStore";
import styles from "../styles/AuthApp.module.css";

export default function LoginForm({ switchToRegister }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authStore = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form.username, form.password);
      authStore.login(data.access, data.refresh);
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Welcome Back</h1>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        <p>
          Don&apos;t have an account?{" "}
          <span onClick={switchToRegister} className={styles.link}>
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
}
