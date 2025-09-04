import axiosInstance from "./axiosInstance";

export async function uploadDataset({ name, file, columnName, userHyperparameters }) {
    console.log("Upload dataset payload:", { name, file, columnName, userHyperparameters });

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", file);
        formData.append("column_name", columnName);
        formData.append("user_hyperparameters", JSON.stringify(userHyperparameters));

        const response = await axiosInstance.post("/datasets/upload/", formData, {
            // Let Axios set Content-Type with boundary automatically
        });

        console.log("Upload dataset response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Upload dataset error:", error.response?.data || error);
        throw error.response?.data || { detail: "Dataset upload failed" };
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
