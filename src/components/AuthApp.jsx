import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Dashboard from "./Dashboard";

export default function AuthApp() {
  const { token, restore } = useAuthStore();
  const [view, setView] = useState("login");

  useEffect(() => {
    restore();
  }, [restore]);

  if (token) return <Dashboard />;

  return view === "login"
    ? <LoginForm switchToRegister={() => setView("register")} />
    : <RegisterForm switchToLogin={() => setView("login")} />;
}