// src/components/ProgressList.jsx
import ProgressItem from './ProgressItem';

const ProgressList = ({ items, userId, onEdit, onDelete }) => {
    return (
        <div className="space-y-4">
            {items.length === 0 ? (
                <p className="text-center text-gray-500">No progress updates yet. Create one!</p>
            ) : (
                items.map(item => (
                    <ProgressItem
                        key={item.id}
                        item={item}
                        userId={userId}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            )}
        </div>
    );
};

export default ProgressList;