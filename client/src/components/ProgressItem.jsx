// src/components/ProgressItem.jsx
import { format } from 'date-fns';

const ProgressItem = ({ item, userId, onEdit, onDelete }) => {
    const isOwner = item.userId === userId;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {format(new Date(item.timestamp), 'MMMM d, yyyy - h:mm a')}
                    </p>
                </div>
                <div className="flex space-x-2">
                    {isOwner && (
                        <>
                            <button
                                onClick={() => onEdit(item)}
                                className="text-persian-indigo hover:text-perano"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {item.category}
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {item.status}
                            </span>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {item.description}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default ProgressItem;