import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, AppBar, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DatasetUpload from './DatasetUpload';
import { useAuthStore } from '../store/authStore';
import { getModels } from '../api/datasetService';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();

useEffect(() => {
   if (accessToken) {
     fetchModels();
   }
 }, []);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching models');
      const data = await getModels();
      setModels(data);
    } catch (err) {
      console.error('Fetch models error:', err.response?.data || err);
      setError(err.detail || 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    console.log('Initiating logout');
    logout(); // Clear tokens and localStorage
    navigate('/login', { replace: true, state: { message: 'Logged out successfully' } });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, mb: 4 }}>
      <AppBar position="static" color="default" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h5">Time Series Forecasting Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </AppBar>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
        <Tab label="Upload Dataset" />
        <Tab label="Models" />
      </Tabs>
      {tabValue === 0 && <DatasetUpload onUploadSuccess={fetchModels} />}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Available Models</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading && <CircularProgress sx={{ mb: 2 }} />}
          {!loading && models.length > 0 ? (
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              {models.map((model, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography>{model.name || `Model ${index + 1}`}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            !loading && <Typography>No models available</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;