import {
  Alert,
  Box,
  Button,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { uploadDataset } from "../api/modelService";

export default function CreateModel({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [columnName, setColumnName] = useState("");
  const [userHyperparameters, setUserHyperparameters] = useState({
    input_sequence_length: 24,
    output_sequence_length: 1,
    num_heads: 4,
    num_layers: 2,
    embedding_dim: 32,
    dropout: 0.1,
    batch_size: 16,
    learning_rate: 0.001,
    epochs: 20,
    apply_differencing: true,
    normalization: "minmax",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    if (!columnName) {
      setMessage("Please provide a column name.");
      return;
    }
    try {
      JSON.parse(JSON.stringify(userHyperparameters)); // Validate JSON
    } catch {
      setMessage("Invalid hyperparameters JSON.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      await uploadDataset({
        file,
        columnName,
        userHyperparameters,
      });
      setMessage("Model created and dataset uploaded successfully!");
      setFile(null);
      setColumnName("");
      onUploadSuccess();
    } catch (error) {
      console.error(error);
      setMessage(error.detail || "Failed to upload dataset.");
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
          maxWidth: 600,
          width: '100%',
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Upload Dataset and Create Model
        </Typography>
        <Input
          type="file"
          inputProps={{ accept: ".csv" }}
          onChange={handleFileChange}
          required
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          required
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Hyperparameters JSON"
          value={JSON.stringify(userHyperparameters, null, 2)}
          onChange={(e) => {
            try {
              setUserHyperparameters(JSON.parse(e.target.value));
            } catch {
              // Ignore invalid JSON until submit
            }
          }}
          multiline
          rows={10}
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
          {loading ? "Uploading..." : "Upload and Train"}
        </Button>
        {message && (
          <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}