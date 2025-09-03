import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthApp() {
  const [view, setView] = useState("login");

  return view === "login" ? (
    <LoginForm switchToRegister={() => setView("register")} />
  ) : (
    <RegisterForm switchToLogin={() => setView("login")} />
  );
}
