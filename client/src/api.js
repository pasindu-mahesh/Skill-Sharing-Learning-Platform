import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/learning-plans';

export const getPlans = () => axios.get(API_BASE);
export const createPlan = (data) => axios.post(API_BASE, data);
export const updatePlan = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deletePlan = (id) => axios.delete(`${API_BASE}/${id}`);
