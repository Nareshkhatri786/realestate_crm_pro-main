import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversionFunnelChart = ({ title = "Conversion Funnel Analysis" }) => {
  const funnelData = [
    { stage: 'Total Leads', count: 1245, percentage: 100, color: 'bg-primary-500', icon: 'Users' },
    { stage: 'Qualified Leads', count: 892, percentage: 71.6, color: 'bg-accent-500', icon: 'UserCheck' },
    { stage: 'Site Visits Scheduled', count: 634, percentage: 50.9, color: 'bg-secondary-500', icon: 'Calendar' },
    { stage: 'Visits Completed', count: 487, percentage: 39.1, color: 'bg-warning-500', icon: 'MapPin' },
    { stage: 'Negotiations Started', count: 298, percentage: 23.9, color: 'bg-purple-500', icon: 'MessageSquare' },
    { stage: 'Bookings Confirmed', count: 156, percentage: 12.5, color: 'bg-success-500', icon: 'CheckCircle' }
  ];

  const getDropoffRate = (current, previous) => {
    if (!previous) return 0;
    return ((previous.count - current.count) / previous.count * 100).toFixed(1);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">Lead to booking conversion funnel with drop-off analysis</p>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {funnelData.map((stage, index) => {
            const previousStage = index > 0 ? funnelData[index - 1] : null;
            const dropoffRate = getDropoffRate(stage, previousStage);
            
            return (
              <div key={stage.stage} className="relative">
                {/* Funnel Stage */}
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${stage.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon name={stage.icon} size={20} className="text-white" />
                  </div>
                  
                  {/* Stage Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-text-primary">{stage.stage}</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-text-primary">{stage.count.toLocaleString()}</span>
                        <span className="text-sm text-text-secondary">{stage.percentage}%</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-secondary-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stage.color}`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Drop-off Indicator */}
                {previousStage && dropoffRate > 0 && (
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-error-50 border border-error-200 rounded-full">
                      <Icon name="TrendingDown" size={14} className="text-error-600" />
                      <span className="text-xs font-medium text-error-600">
                        {dropoffRate}% drop-off
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Connector Line */}
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-px h-4 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">12.5%</p>
              <p className="text-sm text-text-secondary">Overall Conversion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">76.8%</p>
              <p className="text-sm text-text-secondary">Visit Completion Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-600">52.3%</p>
              <p className="text-sm text-text-secondary">Negotiation Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnelChart;