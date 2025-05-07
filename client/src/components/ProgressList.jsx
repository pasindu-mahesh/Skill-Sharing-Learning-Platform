import ProgressItem from './ProgressItem';

const ProgressList = ({ progressUpdates, onDelete }) => {
  if (progressUpdates.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-secondary-500">No progress updates yet</h3>
        <p className="text-secondary-400 mt-1">Add your first progress update to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {progressUpdates.map((item) => (
        <ProgressItem key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProgressList;