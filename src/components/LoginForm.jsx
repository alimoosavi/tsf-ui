import { useState } from "react";
import { login } from "../api/authService";
import { useAuthStore } from "../store/authStore";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from "@mui/material";

export default function LoginForm({ switchToRegister }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authStore = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form.username, form.password);
      authStore.login(data.access, data.refresh);
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome Back
        </Typography>
        <TextField
          fullWidth
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Don&apos;t have an account?{" "}
          <Link
            component="button"
            onClick={switchToRegister}
            sx={{ cursor: 'pointer' }}
          >
            Sign up here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}