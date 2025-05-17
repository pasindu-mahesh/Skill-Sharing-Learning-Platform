// src/api/progressApi.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/progress';

export const createProgressUpdate = (progressData) => {
    return axios.post(API_URL, progressData);
};

export const getProgressUpdates = () => {
    return axios.get(API_URL);
};

export const updateProgressUpdate = (id, progressData, userId) => {
    return axios.put(`${API_URL}/${id}`, progressData, {
        headers: {
            'user-id': userId
        }
    });
};

export const deleteProgressUpdate = (id, userId) => {
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            'user-id': userId
        }
    });
};