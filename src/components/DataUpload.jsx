import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { uploadDataset, getModels } from '../api/datasetService';

const defaultHyperparameters = {
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
    normalization: 'minmax',
};

const DatasetUpload = () => {
    const [name, setName] = useState('generated-time-series');
    const [file, setFile] = useState(null);
    const [columnName, setColumnName] = useState('temperature');
    const [hyperparameters, setHyperparameters] = useState(defaultHyperparameters);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            fetchModels();
        }
    }, [token]);

    const fetchModels = async () => {
        try {
            const data = await getModels();
            setModels(data);
        } catch (err) {
            setError(err.detail || 'Failed to fetch models');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const data = await uploadDataset(name, file, columnName, hyperparameters);
            setSuccess('Dataset uploaded successfully');
            fetchModels(); // Refresh models list
        } catch (err) {
            setError(err.detail || 'Dataset upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Upload Dataset</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            {loading && <CircularProgress sx={{ mb: 2 }} />}
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Dataset Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Column Name"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ margin: '16px 0' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!file || loading}
                    sx={{ mt: 2 }}
                >
                    Upload Dataset
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mt: 4 }}>Available Models</Typography>
            {models.length > 0 ? (
                <ul>
                    {models.map((model, index) => (
                        <li key={index}>{model.name || `Model ${index + 1}`}</li>
                    ))}
                </ul>
            ) : (
                <Typography>No models available</Typography>
            )}
        </Box>
    );
};

export default DatasetUpload;