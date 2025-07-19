import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import OpportunityCard from './OpportunityCard';

const MobileStageView = ({ 
  opportunities, 
  onStageChange, 
  onCardClick, 
  onNurtureToggle 
}) => {
  const [activeStage, setActiveStage] = useState('Scheduled');

  const stages = ['Scheduled', 'Visit Done', 'Negotiation', 'Booking', 'Lost'];

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

  const getStageColor = (stage, isActive = false) => {
    const baseColors = {
      'Scheduled': 'warning',
      'Visit Done': 'primary',
      'Negotiation': 'accent',
      'Booking': 'success',
      'Lost': 'error'
    };
    
    const color = baseColors[stage] || 'secondary';
    
    if (isActive) {
      return `text-${color}-600 bg-${color}-50 border-${color}-200`;
    }
    
    return `text-${color}-600 bg-${color}-50 border-${color}-200 opacity-60`;
  };

  const getOpportunitiesByStage = (stage) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const handleStageSwipe = (direction) => {
    const currentIndex = stages.indexOf(activeStage);
    let newIndex;
    
    if (direction === 'left' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'right' && currentIndex < stages.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return;
    }
    
    setActiveStage(stages[newIndex]);
  };

  const stageOpportunities = getOpportunitiesByStage(activeStage);

  return (
    <div className="lg:hidden">
      {/* Stage Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide mb-4 bg-surface border border-border rounded-lg">
        {stages.map((stage) => {
          const count = getOpportunitiesByStage(stage).length;
          const isActive = stage === activeStage;
          
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                isActive
                  ? `${getStageColor(stage, true)} border-current`
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              }`}
            >
              <Icon name={getStageIcon(stage)} size={16} />
              <span>{stage}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isActive ? 'bg-current bg-opacity-20' : 'bg-secondary-100 text-secondary-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Content */}
      <div className="relative">
        {/* Stage Header */}
        <div className={`p-4 rounded-t-lg border-2 ${getStageColor(activeStage, true)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name={getStageIcon(activeStage)} size={20} />
              <h3 className="font-semibold text-lg">{activeStage}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-surface rounded-full text-sm font-medium">
                {stageOpportunities.length}
              </span>
              
              {/* Navigation Arrows */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleStageSwipe('left')}
                  disabled={stages.indexOf(activeStage) === 0}
                  className="p-1 rounded-full bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
                <button
                  onClick={() => handleStageSwipe('right')}
                  disabled={stages.indexOf(activeStage) === stages.length - 1}
                  className="p-1 rounded-full bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className={`min-h-96 max-h-screen overflow-y-auto p-4 bg-background-secondary border-l-2 border-r-2 border-b-2 rounded-b-lg ${
          getStageColor(activeStage, true).split(' ')[2]
        }`}>
          {stageOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Icon name="Inbox" size={48} className="text-secondary-400 mb-4" />
              <h4 className="text-lg font-medium text-text-primary mb-2">No opportunities in {activeStage.toLowerCase()}</h4>
              <p className="text-sm text-text-secondary">
                {activeStage === 'Scheduled' ?'New opportunities will appear here when site visits are scheduled'
                  : `Opportunities will move here from previous stages`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stageOpportunities.map((opportunity) => (
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

        {/* Swipe Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {stages.map((stage, index) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                stage === activeStage ? 'bg-primary w-6' : 'bg-secondary-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileStageView;