import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ visits = [], currentDate, onDateChange, onVisitClick, viewMode, onViewModeChange }) => {
  const [hoveredVisit, setHoveredVisit] = useState(null);

  // Default currentDate to today if undefined or invalid
  const safeCurrentDate = currentDate && currentDate instanceof Date ? currentDate : new Date();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-primary text-primary-foreground';
      case 'no-show': return 'bg-error text-error-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getVisitsForDate = (date) => {
    if (!date || !visits) return [];
    const dateString = date.toISOString().split('T')[0];
    return visits.filter(visit => visit?.date === dateString);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(safeCurrentDate);
    newDate.setMonth(safeCurrentDate.getMonth() + direction);
    onDateChange?.(newDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    if (!date) return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const days = getDaysInMonth(safeCurrentDate);

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-text-primary">
              {months[safeCurrentDate.getMonth()]} {safeCurrentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                iconName="ChevronLeft"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateChange?.(new Date())}
                className="text-xs"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                iconName="ChevronRight"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-text-secondary">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Confirmed</span>
              <div className="w-3 h-3 bg-warning rounded-full ml-2"></div>
              <span>Pending</span>
              <div className="w-3 h-3 bg-primary rounded-full ml-2"></div>
              <span>Completed</span>
              <div className="w-3 h-3 bg-error rounded-full ml-2"></div>
              <span>No Show</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dayVisits = getVisitsForDate(date);
            const isCurrentDay = isToday(date);
            const isWeekendDay = isWeekend(date);
            
            return (
              <div
                key={index}
                className={`min-h-24 p-1 border border-border rounded-md transition-colors duration-200 ${
                  date ? 'hover:bg-background-secondary cursor-pointer' : ''
                } ${isCurrentDay ? 'bg-primary-50 border-primary-200' : ''} ${
                  isWeekendDay && date ? 'bg-accent-50' : ''
                }`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentDay ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayVisits.slice(0, 3).map((visit) => (
                        <div
                          key={visit?.id}
                          className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${getStatusColor(visit?.status)}`}
                          onClick={() => onVisitClick?.(visit)}
                          onMouseEnter={() => setHoveredVisit(visit)}
                          onMouseLeave={() => setHoveredVisit(null)}
                          title={`${visit?.prospectName} - ${formatTime(visit?.time)}`}
                        >
                          {formatTime(visit?.time)} {visit?.prospectName}
                        </div>
                      ))}
                      {dayVisits.length > 3 && (
                        <div className="text-xs text-text-secondary px-1">
                          +{dayVisits.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredVisit && (
        <div className="fixed z-50 bg-surface border border-border rounded-lg shadow-lg p-3 pointer-events-none"
             style={{ 
               left: '50%', 
               top: '50%', 
               transform: 'translate(-50%, -50%)',
               maxWidth: '250px'
             }}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">{hoveredVisit?.prospectName}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hoveredVisit?.status)}`}>
                {hoveredVisit?.status}
              </span>
            </div>
            <div className="space-y-1 text-xs text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={12} />
                <span>{formatDate(new Date(hoveredVisit?.date))}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} />
                <span>{formatTime(hoveredVisit?.time)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={12} />
                <span>{hoveredVisit?.project}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="User" size={12} />
                <span>{hoveredVisit?.salesExecutive}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;