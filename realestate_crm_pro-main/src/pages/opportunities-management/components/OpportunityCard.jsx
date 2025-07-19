import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import StarRating from '../../../components/ui/StarRating';
import Button from '../../../components/ui/Button';

const OpportunityCard = ({ opportunity, onStageChange, onCardClick, onNurtureToggle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Scheduled': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Visit Done': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'Negotiation': return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'Booking': return 'bg-success-100 text-success-700 border-success-200';
      case 'Lost': return 'bg-error-100 text-error-700 border-error-200';
      default: return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getStageIndicatorColor = (stage) => {
    switch (stage) {
      case 'Scheduled': return 'bg-warning-500';
      case 'Visit Done': return 'bg-primary-500';
      case 'Negotiation': return 'bg-accent-500';
      case 'Booking': return 'bg-success-500';
      case 'Lost': return 'bg-error-500';
      default: return 'bg-secondary-500';
    }
  };

  const getPriorityRating = (priority) => {
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const getLastContactFormatted = (lastContact) => {
    if (!lastContact) return 'No contact';
    const date = new Date(lastContact);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(opportunity));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onCardClick(opportunity)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        bg-surface border border-border rounded-lg p-3 mb-3 cursor-pointer 
        transition-all duration-200 hover:shadow-lg hover:border-primary-200
        relative overflow-hidden
        ${isDragging ? 'opacity-50 transform rotate-2' : ''}
        ${isHovered ? 'transform -translate-y-1' : ''}
      `}
    >
      {/* Status Color Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getStageIndicatorColor(opportunity.stage)}`} />
      
      {/* Header with Name and Star Rating */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-semibold text-text-primary truncate">
              {opportunity.clientName}
            </h4>
            <StarRating rating={getPriorityRating(opportunity.priority)} size={12} />
          </div>
          <p className="text-xs text-text-secondary">{opportunity.phone}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(opportunity.stage)}`}>
            {opportunity.stage}
          </span>
        </div>
      </div>

      {/* Property Type and Location */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-text-primary bg-secondary-50 px-2 py-1 rounded">
            {opportunity.propertyType}
          </span>
          <span className="text-text-secondary">
            {formatCurrency(opportunity.budget)}
          </span>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <Icon name="MapPin" size={12} className="text-secondary-500" />
          <span className="text-xs text-text-secondary truncate">
            {opportunity.location}
          </span>
        </div>
      </div>

      {/* Next Action */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Next Action:</span>
          <span className="text-xs text-warning-600 font-medium">
            {getFormattedDate(opportunity.nextActionDate)}
          </span>
        </div>
        <p className="text-xs text-text-primary mt-1 truncate">
          {opportunity.nextAction}
        </p>
      </div>

      {/* Footer with Quick Actions and Last Contact */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-2">
          {/* Quick Action Buttons - Show on hover */}
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="xs"
              iconName="Phone"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${opportunity.phone}`);
              }}
            />
            <Button
              variant="ghost"
              size="xs"
              iconName="MessageSquare"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://wa.me/91${opportunity.phone.replace(/\D/g, '')}`);
              }}
            />
            <Button
              variant="ghost"
              size="xs"
              iconName="Calendar"
              onClick={(e) => {
                e.stopPropagation();
                // Schedule follow-up action
              }}
            />
          </div>
          
          {/* Assigned Executive - Show when not hovered */}
          <div className={`flex items-center space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-4 h-4 bg-secondary-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-secondary-700">
                {opportunity.assignedTo?.split(' ').map(n => n[0]).join('').substring(0, 1)}
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              {opportunity.assignedTo?.split(' ')[0]}
            </span>
          </div>
        </div>
        
        {/* Last Contact */}
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={10} className="text-secondary-400" />
          <span className="text-xs text-text-muted">
            {getLastContactFormatted(opportunity.lastContact)}
          </span>
        </div>
      </div>

      {/* Nurture Status Indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${opportunity.nurtureActive ? 'bg-success-500' : 'bg-secondary-300'}`} />
      </div>
    </div>
  );
};

export default OpportunityCard;