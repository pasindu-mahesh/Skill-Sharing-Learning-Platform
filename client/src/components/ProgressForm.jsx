// src/components/ProgressForm.jsx
import { useState } from 'react';

const ProgressForm = ({ initialData = {}, onSubmit, userId }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Photography',
        status: initialData.status || 'In Progress',
        userId: userId
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-persian-indigo focus:ring-persian-indigo"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-persian-indigo focus:ring-persian-indigo"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-persian-indigo focus:ring-persian-indigo"
                >
                    <option value="Photography">Photography</option>
                    <option value="Coding">Coding</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1 space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="In Progress"
                            checked={formData.status === 'In Progress'}
                            onChange={handleChange}
                            className="text-persian-indigo focus:ring-persian-indigo"
                        />
                        <span className="ml-2">In Progress</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="Completed"
                            checked={formData.status === 'Completed'}
                            onChange={handleChange}
                            className="text-persian-indigo focus:ring-persian-indigo"
                        />
                        <span className="ml-2">Completed</span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-perano py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-persian-indigo focus:outline-none focus:ring-2 focus:ring-persian-indigo focus:ring-offset-2"
            >
                {initialData.id ? 'Update' : 'Create'} Progress Update
            </button>
        </form>
    );
};

export default ProgressForm;