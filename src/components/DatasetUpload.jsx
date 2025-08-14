import { useState } from "react";
import { uploadDataset } from "../api/datasetService";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Input,
  Alert,
} from "@mui/material";

export default function DatasetUpload() {
  const [name, setName] = useState("");
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
    setLoading(true);
    setMessage("");

    try {
      await uploadDataset({
        name,
        file,
        columnName,
        userHyperparameters,
      });
      setMessage("Dataset uploaded successfully!");
      setName("");
      setFile(null);
      setColumnName("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload dataset.");
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
          Upload Dataset
        </Typography>
        <TextField
          fullWidth
          label="Dataset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
          variant="outlined"
        />
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
              // ignore invalid JSON until submit
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
          {loading ? "Uploading..." : "Upload"}
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