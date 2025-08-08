import { useState } from "react";
import { registerUser } from "../api/authService";
import styles from "../styles/AuthApp.module.css";

export default function RegisterForm({ switchToLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await registerUser(form.username, form.password);
      setMessage("Account created successfully! You can now sign in.");
      setIsSuccess(true);
      setForm({ username: "", password: "" });
      setTimeout(() => switchToLogin(), 2000);
    } catch {
      setMessage("Registration failed. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create Account</h1>
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        {message && (
          <div className={isSuccess ? styles.success : styles.error}>
            {message}
          </div>
        )}
        <p>
          Already have an account?{" "}
          <span onClick={switchToLogin} className={styles.link}>
            Sign in here
          </span>
        </p>
      </form>
    </div>
  );
}