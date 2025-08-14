import { useAuthStore } from "../store/authStore";
import { Box, Paper, Typography, Button } from "@mui/material";

export default function Dashboard() {
  const { logout } = useAuthStore();

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
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Welcome to your data analytics platform! 📊
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}