import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { registerUser } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ switchToLogin }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await registerUser(form.username, form.email, form.password);
      if (data.access && data.refresh) {
        navigate('/', { state: { message: 'Registration successful' } });
      } else {
        setMessage('Account created successfully! Please log in.');
        setIsSuccess(true);
        setTimeout(switchToLogin, 2000);
      }
    } catch (err) {
      setMessage(err.detail || 'Registration failed. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Create Account</Typography>
      {message && <Alert severity={isSuccess ? 'success' : 'error'} sx={{ mt: 2 }}>{message}</Alert>}
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
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <Button onClick={switchToLogin}>Sign in</Button>
      </Typography>
    </Box>
  );
};

export default RegisterForm;