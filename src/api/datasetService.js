import axiosInstance from "./axiosInstance";

export async function uploadDataset({ name, file, columnName, userHyperparameters }) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    formData.append("column_name", columnName);
    formData.append("user_hyperparameters", JSON.stringify(userHyperparameters));

    const response = await axiosInstance.post("datasets/upload/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
