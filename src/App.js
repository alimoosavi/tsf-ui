import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { setAuthToken } from "./api/axiosInstance";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, CircularProgress, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import AuthApp from "./components/AuthApp";
import Dashboard from "./components/Dashboard";
import DatasetUpload from "./components/DatasetUpload";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

const AppContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const AlertContainer = styled(Alert)({
  width: "100%",
  maxWidth: 600,
  marginBottom: 16,
});

const App = () => {
  const { token, restore } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const restoreToken = async () => {
      try {
        await restore();
      } catch (error) {
        setRestoreError("Failed to restore session. Please log in again.");
      } finally {
        setIsRestoring(false);
      }
    };
    restoreToken();
  }, [restore]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);


  if (isRestoring) {
    return (
      <ThemeProvider theme={theme}>
        <AppContainer>
          <CircularProgress />
        </AppContainer>
      </ThemeProvider>
    );
  }

  if (restoreError) {
    return (
      <ThemeProvider theme={theme}>
        <AppContainer>
          <Alert severity="error">{restoreError}</Alert>
        </AppContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        {location.state?.message && (
          <AlertContainer severity="success">
            {location.state.message}
          </AlertContainer>
        )}
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <AuthApp />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" replace /> : <AuthApp />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/upload"
            element={token ? <DatasetUpload /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;