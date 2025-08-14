import { useEffect, useState } from "react";
import { setAuthToken } from "../api/axiosInstance"; // Import setAuthToken
import { useAuthStore } from "../store/authStore";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthApp() {
  const { token, restore } = useAuthStore();
  const [view, setView] = useState("login");

  useEffect(() => {
    restore(); // Restore token from localStorage on mount
  }, [restore]);

  useEffect(() => {
    setAuthToken(token); // Update axiosInstance headers whenever token changes
  }, [token]);

  if (token) return <Dashboard />;

  return view === "login"
    ? <LoginForm switchToRegister={() => setView("register")} />
    : <RegisterForm switchToLogin={() => setView("login")} />;
}