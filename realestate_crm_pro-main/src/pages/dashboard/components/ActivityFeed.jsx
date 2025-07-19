import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities, className = '' }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead': return 'UserPlus';
      case 'call': return 'Phone';
      case 'visit': return 'MapPin';
      case 'opportunity': return 'Target';
      case 'message': return 'MessageSquare';
      case 'booking': return 'CheckCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'lead': return 'text-primary-600 bg-primary-100';
      case 'call': return 'text-success-600 bg-success-100';
      case 'visit': return 'text-warning-600 bg-warning-100';
      case 'opportunity': return 'text-accent-600 bg-accent-100';
      case 'message': return 'text-secondary-600 bg-secondary-100';
      case 'booking': return 'text-success-600 bg-success-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div key={activity.id || index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">
                    {activity.user}
                  </p>
                  <span className="text-xs text-text-muted">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-text-secondary mt-1">
                  {activity.description}
                </p>
                
                {activity.details && (
                  <div className="mt-2 p-2 bg-background-secondary rounded-md">
                    <p className="text-xs text-text-muted">{activity.details}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;