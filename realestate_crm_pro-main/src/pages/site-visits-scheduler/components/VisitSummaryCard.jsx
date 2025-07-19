import React from 'react';
import Icon from '../../../components/AppIcon';

const VisitSummaryCard = ({ title, count, icon, color, trend, trendValue }) => {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon name={icon} size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{count}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-success' : 'text-error'
          }`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} />
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitSummaryCard;