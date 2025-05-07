const StatsCard = ({ title, value, icon, color }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-secondary-500">{title}</p>
          <p className="text-2xl font-semibold text-secondary-800">{value}</p>
        </div>
      </div>
    );
  };
  
  export default StatsCard;