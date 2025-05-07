import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgressUpdate } from '../services/api';
import ProgressForm from '../components/ProgressForm';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProgress = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Format the date properly for the API
      const apiData = {
        ...formData,
        date: new Date(formData.date) // Convert string date to Date object
      };
      
      const response = await createProgressUpdate(apiData);
      
      toast.success('Progress update added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error adding progress update:', error);
      toast.error(error.response?.data?.message || 'Failed to add progress update', {
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

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          initialData={{
            title: '',
            description: '',
            category: 'Technique',
            status: 'In Progress',
            date: format(new Date(), 'yyyy-MM-dd')
          }}
        />
      </div>
    </div>
  );
};

export default AddProgress;