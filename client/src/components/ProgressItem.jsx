import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors = {
  'Not Started': 'bg-red-100 text-red-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Mastered: 'bg-blue-100 text-blue-800',
};

const ProgressItem = ({ item, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-primary-800 mb-1">{item.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
        <p className="text-sm text-secondary-600 mb-2">{format(new Date(item.date), 'MMM d, yyyy')}</p>
        <p className="text-secondary-700 mb-3">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="inline-block bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded">
            {item.category}
          </span>
          <div className="flex space-x-2">
            <Link
              to={`/edit/${item._id}`}
              className="text-secondary-500 hover:text-primary-600 transition-colors duration-200"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <button
              onClick={() => onDelete(item._id)}
              className="text-secondary-500 hover:text-red-600 transition-colors duration-200"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressItem;