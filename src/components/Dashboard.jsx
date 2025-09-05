import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getModels, predict } from "../api/datasetService";
import { useAuthStore } from "../store/authStore";
import DatasetUpload from "./DatasetUpload";

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1400,
  margin: "32px auto",
  paddingBottom: theme.spacing(4),
}));

const HeaderBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const ModelsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ModelCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: "0.3s",
  "&:hover": {
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
}));

// 🔹 Modal to show full model details + predict
function ModelDetailsModal({ open, onClose, model }) {
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!model) return null;

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const contextArray = context
        .split(",")
        .map((v) => parseFloat(v.trim()))
        .filter((v) => !isNaN(v));

      const response = await predict(model.id, contextArray);
      setResult(response.prediction);
    } catch (err) {
      console.error(err);
      setError(err.detail || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const details = model.architecture_details;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Model #{model.id} — Details
      </DialogTitle>
      <DialogContent dividers>
        {/* General Info */}
        <Typography variant="subtitle1" gutterBottom>
          Dataset ID: {model.dataset}
        </Typography>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Created at: {new Date(model.created_at).toLocaleString()}
        </Typography>

        {/* Model Hyperparameters */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Architecture Details
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(details).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <TextField
                label={key}
                value={String(value)}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Prediction Input */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Run Prediction
        </Typography>
        <Typography variant="body2" gutterBottom>
          Enter a context array of{" "}
          {model.architecture_details.input_sequence_length} numbers (comma
          separated).
        </Typography>
        <TextField
          label="Input Context"
          fullWidth
          multiline
          minRows={3}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          margin="normal"
        />

        {/* Results */}
        {loading && <CircularProgress size={24} />}
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
        {result && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success">
              Prediction: {JSON.stringify(result)}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handlePredict} variant="contained" disabled={loading}>
          Predict
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchModels = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getModels();
      setModels(data);
    } catch (err) {
      console.error("Fetch models error:", err.response?.data || err);
      setError(err.detail || "Failed to fetch models");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
      state: { message: "Logged out successfully" },
    });
  };

  const handleMoreInfoClick = (model) => {
    setSelectedModel(model);
    setModalOpen(true);
  };

  return (
    <DashboardContainer>
      {/* Header */}
      <HeaderBar position="static">
        <HeaderContent>
          <Typography variant="h5" fontWeight="600">
            📊 Time Series Forecasting Dashboard
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </HeaderContent>
      </HeaderBar>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Upload Dataset" />
        <Tab label="Models" />
      </Tabs>

      {/* Tab Panels */}
      {tabValue === 0 && <DatasetUpload onUploadSuccess={fetchModels} />}

      {tabValue === 1 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Available Models
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}

          {!loading && models.length > 0 ? (
            <ModelsGrid container spacing={3}>
              {models.map((model) => (
                <Grid item xs={12} sm={6} md={4} key={model.id}>
                  <ModelCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Model #{model.id} ({model.architecture_details.type})
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Dataset ID: {model.dataset}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Typography variant="body2">
                        <strong>Epochs:</strong>{" "}
                        {model.architecture_details.epochs}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Layers:</strong>{" "}
                        {model.architecture_details.num_layers}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Batch Size:</strong>{" "}
                        {model.architecture_details.batch_size}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Learning Rate:</strong>{" "}
                        {model.architecture_details.learning_rate}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong>{" "}
                        {new Date(model.created_at).toLocaleString()}
                      </Typography>
                    </CardContent>

                    <CardActions>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleMoreInfoClick(model)}
                      >
                        More Info
                      </Button>
                    </CardActions>
                  </ModelCard>
                </Grid>
              ))}
            </ModelsGrid>
          ) : (
            !loading && (
              <Typography color="text.secondary">
                No models available yet. Upload a dataset to train a model.
              </Typography>
            )
          )}
        </Box>
      )}

      {/* Details + Predict Modal */}
      {selectedModel && (
        <ModelDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          model={selectedModel}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
