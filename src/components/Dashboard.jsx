import { useAuthStore } from "../store/authStore";
import styles from "../styles/AuthApp.module.css";

export default function Dashboard() {
  const { logout } = useAuthStore();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Analytics Dashboard</h1>
        <p>Welcome to your data analytics platform! 📊</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
