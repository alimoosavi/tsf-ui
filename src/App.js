import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthApp from "./components/AuthApp";
import Dashboard from "./components/Dashboard";
import { useAuthStore } from "./store/authStore";

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

const useSessionRestore = () => {
  const { restore, accessToken, logout } = useAuthStore();
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState(null);

  const restoreSession = useCallback(async () => {
    try {
      console.log('Starting session restore');
      await restore();
      setRestoreError(null);
    } catch (error) {
    } finally {
      setIsRestoring(false);
    }
  }, [restore]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const retryRestore = useCallback(() => {
    setIsRestoring(true);
    setRestoreError(null);
    restoreSession();
  }, [restoreSession]);

  const handleLoginRedirect = useCallback(() => {
    console.log('Handling login redirect');
    logout();
    setRestoreError(null);
    window.location.href = '/login';
  }, [logout]);

  return { isRestoring, restoreError, retryRestore, handleLoginRedirect, accessToken };
};

const ProtectedRoute = ({ children, accessToken, redirectTo = "/login" }) => {
  console.log('ProtectedRoute check, accessToken:', accessToken);
  return accessToken ? children : <Navigate to={redirectTo} replace />;
};

const PublicRoute = ({ children, accessToken, redirectTo = "/" }) => {
  console.log('PublicRoute check, accessToken:', accessToken);
  return accessToken ? <Navigate to={redirectTo} replace /> : children;
};

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

const SuccessMessage = ({ message }) => (
  <AlertContainer severity="success">{message}</AlertContainer>
);

const App = () => {
  const { isRestoring, restoreError, retryRestore, handleLoginRedirect, accessToken } = useSessionRestore();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  if (isRestoring) {
    return <LoadingScreen />;
  }

  if (restoreError) {
    return <ErrorScreen error={restoreError} onRetry={retryRestore} onLogin={handleLoginRedirect} />;
  }

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