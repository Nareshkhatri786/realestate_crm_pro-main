import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SiteVisitTracker = ({ visits, className = '' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getVisitsByDate = (date) => {
    return visits.filter(visit => visit.date === date);
  };

  const getVisitStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-100';
      case 'scheduled': return 'text-primary-600 bg-primary-100';
      case 'rescheduled': return 'text-warning-600 bg-warning-100';
      case 'no_show': return 'text-error-600 bg-error-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const getVisitStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'scheduled': return 'Clock';
      case 'rescheduled': return 'RotateCcw';
      case 'no_show': return 'XCircle';
      default: return 'Calendar';
    }
  };

  const todayVisits = getVisitsByDate(selectedDate);
  const completedVisits = todayVisits.filter(v => v.status === 'completed').length;
  const scheduledVisits = todayVisits.filter(v => v.status === 'scheduled').length;
  const noShowVisits = todayVisits.filter(v => v.status === 'no_show').length;

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Site Visit Tracker</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-600">{completedVisits}</p>
            <p className="text-xs text-text-secondary">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">{scheduledVisits}</p>
            <p className="text-xs text-text-secondary">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-600">{noShowVisits}</p>
            <p className="text-xs text-text-secondary">No Show</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {todayVisits.length === 0 ? (
            <div className="text-center py-6">
              <Icon name="Calendar" size={48} className="text-secondary-400 mx-auto mb-3" />
              <p className="text-text-secondary">No visits scheduled for this date</p>
            </div>
          ) : (
            todayVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${getVisitStatusColor(visit.status)}`}>
                    <Icon name={getVisitStatusIcon(visit.status)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {visit.clientName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-muted">
                        {formatTime(visit.time)}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">
                        {visit.project}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {visit.status === 'scheduled' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        iconName="CheckCircle"
                        onClick={() => console.log('Mark as completed:', visit.id)}
                      />
                      <Button
                        variant="warning"
                        size="sm"
                        iconName="RotateCcw"
                        onClick={() => console.log('Reschedule:', visit.id)}
                      />
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Phone"
                    onClick={() => window.open(`tel:${visit.phone}`)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteVisitTracker;