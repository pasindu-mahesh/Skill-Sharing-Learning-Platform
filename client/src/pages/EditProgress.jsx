import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProgressUpdates, updateProgressUpdate } from '../services/api';
import ProgressForm from '../components/ProgressForm';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getProgressUpdates();
        const item = response.data.find(item => item._id === id);
        
        if (item) {
          // Format the data for the form
          setInitialData({
            ...item,
            date: format(parseISO(item.date), 'yyyy-MM-dd')
          });
        } else {
          toast.error('Progress update not found', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching progress update:', error);
        toast.error('Failed to load progress update', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Format the date properly for the API
      const apiData = {
        ...formData,
        date: new Date(formData.date) // Convert string date to Date object
      };
      
      const response = await updateProgressUpdate(id, apiData);
      
      toast.success('Progress update updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error updating progress update:', error);
      toast.error(error.response?.data?.message || 'Failed to update progress update', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          isEditing={true} 
        />
      </div>
    </div>
  );
};

export default EditProgress;