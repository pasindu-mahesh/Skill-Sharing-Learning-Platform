import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, CameraIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getProgressUpdates } from '../services/api';
import ProgressList from '../components/ProgressList';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getProgressUpdates();
        setProgressUpdates(response.data);
      } catch (error) {
        console.error('Error fetching progress updates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProgressUpdate(id);
      setProgressUpdates(progressUpdates.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting progress update:', error);
    }
  };

  // Calculate stats for the dashboard
  const totalUpdates = progressUpdates.length;
  const completedUpdates = progressUpdates.filter(item => item.status === 'Completed' || item.status === 'Mastered').length;
  const inProgressUpdates = progressUpdates.filter(item => item.status === 'In Progress').length;

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Photography Progress Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Updates"
            value={totalUpdates}
            icon={<CameraIcon className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={completedUpdates}
            icon={<CheckCircleIcon className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="In Progress"
            value={inProgressUpdates}
            icon={<ArrowPathIcon className="h-6 w-6" />}
            color="yellow"
          />
          <StatsCard
            title="Mastery Rate"
            value={`${totalUpdates > 0 ? Math.round((completedUpdates / totalUpdates) * 100) : 0}%`}
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="blue"
          />
        </div>

        {/* Recent Updates */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-secondary-800">Recent Progress Updates</h2>
          <Link
            to="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add New
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <ProgressList progressUpdates={progressUpdates} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;