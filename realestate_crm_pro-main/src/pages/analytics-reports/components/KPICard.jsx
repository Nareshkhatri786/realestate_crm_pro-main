import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success-600';
    if (changeType === 'negative') return 'text-error-600';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="card hover-lift">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {change && (
              <div className={`flex items-center space-x-1 mt-2 ${getChangeColor()}`}>
                <Icon name={getChangeIcon()} size={14} />
                <span className="text-sm font-medium">{change}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-2">
              <Icon name={icon} size={24} className="text-primary-600" />
            </div>
            {trend && (
              <div className="w-16 h-8 flex items-end space-x-0.5">
                {trend.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary-200 rounded-sm"
                    style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;