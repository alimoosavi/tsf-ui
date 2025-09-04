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
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getModels, predict } from "../api/datasetService";
import { useAuthStore } from "../store/authStore";
import DatasetUpload from "./DatasetUpload";

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1200,
  margin: "32px auto",
  paddingBottom: theme.spacing(4),
}));

const HeaderBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
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
  boxShadow: theme.shadows[1],
  "&:hover": {
    boxShadow: theme.shadows[4],
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Model #{model.id} Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Dataset ID: {model.dataset}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Created at: {new Date(model.created_at).toLocaleString()}
        </Typography>

        {/* Table for model details */}
        <Table size="small" sx={{ mb: 2 }}>
          <TableBody>
            {Object.entries(model.architecture_details).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ fontWeight: "bold" }}>{key}</TableCell>
                <TableCell>{String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Predict Input */}
        <Typography variant="h6" gutterBottom>
          Predict
        </Typography>
        <Typography variant="body2" gutterBottom>
          Enter a context array of {model.architecture_details.input_sequence_length} numbers (comma separated).
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

        {loading && <CircularProgress size={24} />}
        {error && <Alert severity="error">{error}</Alert>}
        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Prediction: {JSON.stringify(result)}
          </Alert>
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
      <HeaderBar position="static" color="default">
        <HeaderContent>
          <Typography variant="h5">Time Series Forecasting Dashboard</Typography>
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
                        <strong>Epochs:</strong> {model.architecture_details.epochs}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Layers:</strong> {model.architecture_details.num_layers}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Batch Size:</strong> {model.architecture_details.batch_size}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Learning Rate:</strong> {model.architecture_details.learning_rate}
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
