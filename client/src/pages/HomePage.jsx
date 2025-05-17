// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProgressList from '../components/ProgressList';
import { getProgressUpdates, deleteProgressUpdate } from '../api/progressApi';

const HomePage = () => {
    const [progressUpdates, setProgressUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // In a real app, this would come from authentication
    const userId = 1; // Hardcoded for demo purposes

    useEffect(() => {
        const fetchProgressUpdates = async () => {
            try {
                const response = await getProgressUpdates();
                setProgressUpdates(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProgressUpdates();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteProgressUpdate(id, userId);
            setProgressUpdates(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete progress update');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-persian-indigo">My Photography Progress</h1>
                <Link
                    to="/add"
                    className="bg-perano text-white px-4 py-2 rounded-md hover:bg-persian-indigo transition-colors"
                >
                    Add Progress
                </Link>
            </div>
            
            <ProgressList
                items={progressUpdates}
                userId={userId}
                onEdit={() => {}}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default HomePage;