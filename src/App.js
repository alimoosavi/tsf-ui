import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { setAuthToken } from "./api/axiosInstance";
import AuthApp from "./components/AuthApp";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./store/authStore";

// Theme configuration
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

// Styled components
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

// Custom hook for session restoration
const useSessionRestore = () => {
  const { restore, accessToken, logout } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState(null);

  const restoreSession = useCallback(async () => {
    try {
      console.log('Starting session restore');
      await restore();
      console.log('Session restored, accessToken:', accessToken);
      setRestoreError(null);
    } catch (error) {
      console.error('Session restore failed:', error.response?.data || error.message);
      setRestoreError("Failed to restore session. Please log in again.");
    } finally {
      setIsRestoring(false);
    }
  }, [restore, accessToken]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const retryRestore = useCallback(() => {
    setIsRestoring(true);
    setRestoreError(null);
    restoreSession();
  }, [restoreSession]);

  const handleLoginRedirect = useCallback(() => {
    logout();
    setRestoreError(null);
    window.location.href = '/login';
  }, [logout]);

  return { isRestoring, restoreError, retryRestore, handleLoginRedirect, accessToken };
};

// Protected Route component
const ProtectedRoute = ({ children, accessToken, redirectTo = "/login" }) => {
  return accessToken ? children : <Navigate to={redirectTo} replace />;
};

// Public Route component
const PublicRoute = ({ children, accessToken, redirectTo = "/" }) => {
  return accessToken ? <Navigate to={redirectTo} replace /> : children;
};

// Loading component
const LoadingScreen = () => (
  <ThemeProvider theme={theme}>
    <AppContainer>
      <CircularProgress size={48} />
      <Box mt={2} color="text.secondary">
        Restoring session...
      </Box>
    </AppContainer>
  </ThemeProvider>
);

// Error screen component
const ErrorScreen = ({ error, onRetry, onLogin }) => (
  <ThemeProvider theme={theme}>
    <AppContainer>
      <AlertContainer severity="error">{error}</AlertContainer>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="contained" color="primary" onClick={onLogin}>
          Log In Again
        </Button>
      </Box>
    </AppContainer>
  </ThemeProvider>
);

// Success message component
const SuccessMessage = ({ message }) => (
  <AlertContainer severity="success">{message}</AlertContainer>
);

const App = () => {
  const { isRestoring, restoreError, retryRestore, handleLoginRedirect, accessToken } = useSessionRestore();
  const location = useLocation();

  // Set auth token when accessToken changes
  useEffect(() => {
    console.log('Setting auth token:', accessToken);
    setAuthToken(accessToken);
  }, [accessToken]);

  // Memoize success message
  const successMessage = useMemo(() => location.state?.message, [location.state?.message]);

  // Show loading screen during session restoration
  if (isRestoring) {
    return <LoadingScreen />;
  }

  // Show error screen if restoration failed
  if (restoreError) {
    return <ErrorScreen error={restoreError} onRetry={retryRestore} onLogin={handleLoginRedirect} />;
  }

  // Main application routes
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        {successMessage && <SuccessMessage message={successMessage} />}
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute accessToken={accessToken}>
                <AuthApp />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute accessToken={accessToken}>
                <AuthApp />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute accessToken={accessToken}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;