// src/pages/AddProgressPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressForm from '../components/ProgressForm';
import { createProgressUpdate } from '../api/progressApi';

const AddProgressPage = () => {
    const navigate = useNavigate();
    // In a real app, this would come from authentication
    const userId = 1; // Hardcoded for demo purposes

    const handleSubmit = async (formData) => {
        try {
            await createProgressUpdate(formData);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create progress update');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-persian-indigo mb-6">Add Progress Update</h1>
            <ProgressForm onSubmit={handleSubmit} userId={userId} />
        </div>
    );
};

export default AddProgressPage;