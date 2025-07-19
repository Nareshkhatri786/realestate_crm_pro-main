import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingVisitsList = ({ visits, onViewDetails, onReschedule }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success bg-success-50 border-success-200';
      case 'pending': return 'text-warning bg-warning-50 border-warning-200';
      case 'completed': return 'text-primary bg-primary-50 border-primary-200';
      case 'no-show': return 'text-error bg-error-50 border-error-200';
      default: return 'text-text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Upcoming Visits</h3>
        <p className="text-sm text-text-secondary">Next 7 days</p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {visits.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Calendar" size={48} className="text-secondary-300 mx-auto mb-3" />
            <p className="text-text-secondary">No upcoming visits scheduled</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {visits.map((visit) => (
              <div key={visit.id} className="p-3 border border-border rounded-lg hover:bg-background-secondary transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-text-primary truncate">{visit.prospectName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(visit.status)}`}>
                        {visit.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Icon name="Calendar" size={12} />
                        <span>{visit.date}</span>
                        <Icon name="Clock" size={12} />
                        <span>{formatTime(visit.time)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Icon name="MapPin" size={12} />
                        <span className="truncate">{visit.project}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Icon name="User" size={12} />
                        <span>{visit.salesExecutive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onViewDetails(visit)}
                      className="text-xs"
                    >
                      View
                    </Button>
                    {visit.status === 'confirmed' && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => onReschedule(visit)}
                        className="text-xs text-warning"
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingVisitsList;