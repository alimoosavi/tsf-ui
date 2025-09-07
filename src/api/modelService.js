import axiosInstance from "./axiosInstance";

export async function uploadDataset({ file, columnName, userHyperparameters }) {
    console.log("Upload dataset payload:", { file, columnName, userHyperparameters });

    try {
        const formData = new FormData();
        formData.append("dataset_file", file);
        formData.append("column_name", columnName);
        formData.append("user_hyperparameters", JSON.stringify(userHyperparameters));

        const response = await axiosInstance.post("/models/upload/", formData);

        console.log("Upload dataset response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Upload dataset error:", error.response?.data || error);
        if (error.response?.data) {
            const errors = error.response.data;
            const formattedErrors = Object.entries(errors)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                .join("; ");
            throw { detail: formattedErrors || "Dataset upload failed" };
        }
        throw { detail: "Dataset upload failed" };
    }
}

export async function getModels() {
    console.log('Fetching models');
    try {
        const response = await axiosInstance.get("/models/");
        console.log('Get models response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Get models error:', error.response?.data || error);
        throw error.response?.data || { detail: "Failed to fetch models" };
    }
}

export async function cancelModel(modelId) {
    console.log('Canceling model:', modelId);
    try {
        const response = await axiosInstance.post(`/models/${modelId}/cancel/`);
        console.log('Cancel model response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Cancel model error:', error.response?.data || error);
        throw error.response?.data || { detail: "Failed to cancel model" };
    }
}

export async function predict(modelId, context) {
    console.log("Prediction request:", { modelId, context });

    try {
        const response = await axiosInstance.post(`/models/${modelId}/predict/`, {
            context,
        });

        console.log("Prediction response:", response.data);
        return response.data; // { prediction: [ ... ] }
    } catch (error) {
        console.error("Prediction error:", error.response?.data || error);
        throw error.response?.data || { detail: "Prediction failed" };
    }
}