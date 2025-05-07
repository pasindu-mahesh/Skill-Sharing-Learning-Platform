import { Link } from 'react-router-dom';
import { CameraIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="bg-primary-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <CameraIcon className="h-8 w-8 text-primary-300" />
            <span className="text-xl font-bold">Photogram</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-primary-700">
              <ChartBarIcon className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            <Link to="/add" className="flex items-center px-3 py-2 rounded-md hover:bg-primary-700">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Progress
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}