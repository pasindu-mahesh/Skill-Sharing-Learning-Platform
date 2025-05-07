import axios from 'axios';

const API_URL = 'http://localhost:8080/progress';

// Add request interceptor to include auth token in real app
axios.interceptors.request.use(config => {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getProgressUpdates = () => axios.get(API_URL);
export const createProgressUpdate = (update) => axios.post(API_URL, update);
export const updateProgressUpdate = (id, update) => axios.put(`${API_URL}/${id}`, update);
export const deleteProgressUpdate = (id) => axios.delete(`${API_URL}/${id}`);