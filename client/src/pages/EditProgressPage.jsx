// src/pages/EditProgressPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressForm from '../components/ProgressForm';
import { getProgressUpdates, updateProgressUpdate } from '../api/progressApi';

const EditProgressPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [progressUpdate, setProgressUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // In a real app, this would come from authentication
    const userId = 1; // Hardcoded for demo purposes

    useEffect(() => {
        const fetchProgressUpdate = async () => {
            try {
                const response = await getProgressUpdates();
                const update = response.data.find(item => item.id.toString() === id);
                if (update) {
                    setProgressUpdate(update);
                } else {
                    setError('Progress update not found');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProgressUpdate();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            await updateProgressUpdate(id, formData, userId);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update progress update');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!progressUpdate) return <div>Progress update not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-persian-indigo mb-6">Edit Progress Update</h1>
            <ProgressForm 
                initialData={progressUpdate} 
                onSubmit={handleSubmit} 
                userId={userId} 
            />
        </div>
    );
};

export default EditProgressPage;