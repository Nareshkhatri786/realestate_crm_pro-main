import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import OpportunityCard from './OpportunityCard';

const StageColumn = ({ 
  stage, 
  opportunities, 
  onStageChange, 
  onCardClick, 
  onNurtureToggle,
  stageStats 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'Scheduled': return 'Calendar';
      case 'Visit Done': return 'CheckCircle';
      case 'Negotiation': return 'MessageSquare';
      case 'Booking': return 'CreditCard';
      case 'Lost': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Scheduled': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Visit Done': return 'text-primary-600 bg-primary-50 border-primary-200';
      case 'Negotiation': return 'text-accent-600 bg-accent-50 border-accent-200';
      case 'Booking': return 'text-success-600 bg-success-50 border-success-200';
      case 'Lost': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-secondary-600 bg-secondary-50 border-secondary-200';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const opportunityData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (opportunityData.stage !== stage) {
        onStageChange(opportunityData.id, stage);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
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

  return (
    <div className="flex-1 min-w-80 max-w-sm">
      {/* Collapsible Column Header */}
      <div className={`p-3 rounded-t-lg border-2 ${getStageColor(stage)} ${isDragOver ? 'border-dashed' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center space-x-2 hover:opacity-70 transition-opacity"
            >
              <Icon name={getStageIcon(stage)} size={18} />
              <h3 className="font-semibold text-lg">{stage}</h3>
              <Icon 
                name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
                size={16} 
                className="text-secondary-500"
              />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-surface rounded-full text-sm font-medium">
              {opportunities.length}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <Icon name={isCollapsed ? "Maximize2" : "Minimize2"} size={14} />
            </button>
          </div>
        </div>
        
        {/* Stage Statistics - Enhanced */}
        {stageStats && !isCollapsed && (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Value:</span>
              <span className="font-semibold">{formatCurrency(stageStats.totalValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Avg. Days:</span>
              <span className="font-semibold">{stageStats.avgDays} days</span>
            </div>
            {opportunities.length > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Avg. Value:</span>
                <span className="font-semibold">
                  {formatCurrency(Math.round(stageStats.totalValue / opportunities.length))}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Column Content */}
      {!isCollapsed && (
        <div
          className={`min-h-96 max-h-screen overflow-y-auto p-3 bg-background-secondary border-l-2 border-r-2 border-b-2 rounded-b-lg transition-all duration-200 ${
            getStageColor(stage).split(' ')[2]
          } ${isDragOver ? 'bg-opacity-20 border-dashed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {opportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icon name="Inbox" size={32} className="text-secondary-400 mb-2" />
              <p className="text-sm text-text-secondary">No opportunities in {stage.toLowerCase()}</p>
              <p className="text-xs text-text-muted mt-1">Drag cards here to update stage</p>
            </div>
          ) : (
            <div className="space-y-2">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onStageChange={onStageChange}
                  onCardClick={onCardClick}
                  onNurtureToggle={onNurtureToggle}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Collapsed State Summary */}
      {isCollapsed && (
        <div className={`p-2 border-l-2 border-r-2 border-b-2 rounded-b-lg bg-background-secondary ${getStageColor(stage).split(' ')[2]}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">
              {opportunities.length} opportunities
            </p>
            {stageStats && (
              <p className="text-xs text-text-secondary">
                {formatCurrency(stageStats.totalValue)} total
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageColumn;