import axiosInstance from "./axiosInstance";

export async function uploadDataset(name, file, columnName, hyperparameters) {
    console.log('Upload dataset payload:', { name, file, columnName, hyperparameters });
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);
        formData.append('column_name', columnName);
        formData.append('user_hyperparameters', JSON.stringify(hyperparameters));

        const response = await axiosInstance.post("/datasets/upload/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log('Upload dataset response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Upload dataset error:', error.response?.data || error);
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