import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FollowUpList = ({ followUps, onFollowUpComplete, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState('today');

  const tabs = [
    { id: 'today', label: 'Today', count: followUps.filter(f => f.type === 'today').length },
    { id: 'overdue', label: 'Overdue', count: followUps.filter(f => f.type === 'overdue').length },
    { id: 'upcoming', label: 'Upcoming', count: followUps.filter(f => f.type === 'upcoming').length }
  ];

  const filteredFollowUps = followUps.filter(followUp => followUp.type === selectedTab);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error-600 bg-error-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Follow-ups</h3>
        
        <div className="flex space-x-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                selectedTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  selectedTab === tab.id 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-secondary-200 text-secondary-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredFollowUps.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="CheckCircle" size={48} className="text-success-500 mx-auto mb-3" />
              <p className="text-text-secondary">No {selectedTab} follow-ups</p>
            </div>
          ) : (
            filteredFollowUps.map((followUp) => (
              <div key={followUp.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(followUp.priority)}`}>
                    {followUp.priority}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {followUp.leadName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-muted">
                        {formatTime(followUp.scheduledTime)}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">
                        {followUp.project}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Phone"
                    onClick={() => window.open(`tel:${followUp.phone}`)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MessageSquare"
                    onClick={() => window.open(`https://wa.me/91${followUp.phone}`)}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onFollowUpComplete(followUp.id)}
                  >
                    Complete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUpList;