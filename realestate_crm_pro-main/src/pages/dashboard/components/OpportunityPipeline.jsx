import React from 'react';
import Icon from '../../../components/AppIcon';

const OpportunityPipeline = ({ opportunities, className = '' }) => {
  const stages = [
    { id: 'scheduled', name: 'Scheduled', color: 'bg-secondary-500', icon: 'Calendar' },
    { id: 'visit_done', name: 'Visit Done', color: 'bg-primary-500', icon: 'MapPin' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-warning-500', icon: 'MessageCircle' },
    { id: 'booking', name: 'Booking', color: 'bg-success-500', icon: 'CheckCircle' },
    { id: 'lost', name: 'Lost', color: 'bg-error-500', icon: 'XCircle' }
  ];

  const getStageData = (stageId) => {
    const stageOpportunities = opportunities.filter(opp => opp.stage === stageId);
    const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);
    return {
      count: stageOpportunities.length,
      value: totalValue,
      opportunities: stageOpportunities
    };
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Opportunity Pipeline</h3>
          <button className="text-sm text-primary hover:text-primary-700 font-medium">
            View Details
          </button>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const stageData = getStageData(stage.id);
            return (
              <div key={stage.id} className="text-center">
                <div className="relative mb-3">
                  <div className={`w-16 h-16 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon name={stage.icon} size={24} className="text-white" />
                  </div>
                  {stageData.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {stageData.count}
                    </div>
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-text-primary mb-1">{stage.name}</h4>
                <p className="text-xs text-text-secondary mb-1">{stageData.count} opportunities</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(stageData.value)}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {opportunities.length}
              </p>
              <p className="text-sm text-text-secondary">Total Opportunities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.value, 0))}
              </p>
              <p className="text-sm text-text-secondary">Pipeline Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityPipeline;