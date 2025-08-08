import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import AuthApp from "./pages/Auth";
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
              !isAuthenticated ? <AuthApp initialView="register" /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? <AuthApp initialView="login" /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <div className={styles.dashboardContainer}>
                  <div className={styles.dashboardCard}>
                    <h1 className={styles.dashboardTitle}>Analytics Dashboard</h1>
                    <p className={styles.dashboardSubtitle}>
                      Welcome to your data analytics platform! 📊
                    </p>
                    <div className={styles.dashboardGrid}>
                      {['Data Sources', 'ML Models', 'Reports', 'Pipelines'].map((item, i) => (
                        <div key={i} className={styles.dashboardItem}>
                          {item}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        window.location.href = "/login";
                      }}
                      className={styles.logoutButton}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
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
