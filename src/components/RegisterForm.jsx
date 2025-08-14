import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { registerUser } from "../api/authService";

export default function RegisterForm({ switchToLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await registerUser(form.username, form.password);
      setMessage("Account created successfully! You can now sign in.");
      setIsSuccess(true);
      setForm({ username: "", password: "" });
      setTimeout(() => switchToLogin(), 2000);
    } catch {
      setMessage("Registration failed. Please try again.");
      setIsSuccess(false);
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
          Create Account
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
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
        {message && (
          <Alert severity={isSuccess ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account?{" "}
          <Link
            component="button"
            onClick={switchToLogin}
            sx={{ cursor: 'pointer' }}
          >
            Sign in here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}