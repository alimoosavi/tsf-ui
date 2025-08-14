import { Navigate, Route, BrowserRouter as Router, Routes, Link } from "react-router-dom";
import AuthApp from "./components/AuthApp";
import Dashboard from "./components/Dashboard";
import styles from "./styles/App.module.css";

function App() {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <Router>
      <div>
        {!isAuthenticated && (
          <nav className={styles.navbar}>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/register" className={styles.navLink}>Register</Link>
          </nav>
        )}

        <Routes>
          <Route
            path="/register"
            element={
              !isAuthenticated
                ? <AuthApp initialView="register" />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated
                ? <AuthApp initialView="login" />
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated
                ? <Dashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
