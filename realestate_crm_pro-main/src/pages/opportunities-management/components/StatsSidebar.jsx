import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSidebar = ({ stats, onStageFilter }) => {
  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

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

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success-600';
    if (trend < 0) return 'text-error-600';
    return 'text-secondary-600';
  };

  return (
    <div className="w-80 bg-surface border border-border rounded-lg p-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Pipeline Overview</h3>
        <Icon name="BarChart3" size={20} className="text-secondary-600" />
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary-600 font-medium">Total Opportunities</p>
              <p className="text-xl font-bold text-primary-700">{stats.total.count}</p>
            </div>
            <Icon name="Target" size={24} className="text-primary-600" />
          </div>
        </div>

        <div className="bg-success-50 border border-success-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-success-600 font-medium">Total Value</p>
              <p className="text-lg font-bold text-success-700">{formatCurrency(stats.total.value)}</p>
            </div>
            <Icon name="IndianRupee" size={24} className="text-success-600" />
          </div>
        </div>
      </div>

      {/* Stage-wise Stats */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-text-primary">Stage Distribution</h4>
        {stats.stages.map((stage) => (
          <button
            key={stage.name}
            onClick={() => onStageFilter(stage.name)}
            className={`w-full p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getStageColor(stage.name)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name={getStageIcon(stage.name)} size={16} />
                <span className="text-sm font-medium">{stage.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{stage.count}</p>
                <p className="text-xs opacity-75">{formatCurrency(stage.value)}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 bg-white bg-opacity-50 rounded-full h-1.5">
              <div 
                className="bg-current h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(stage.count / stats.total.count) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Conversion Metrics */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-text-primary">Conversion Metrics</h4>
        
        <div className="bg-background-secondary rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Visit to Booking</span>
            <div className="flex items-center space-x-1">
              <Icon name={getTrendIcon(stats.conversions.visitToBooking.trend)} size={12} className={getTrendColor(stats.conversions.visitToBooking.trend)} />
              <span className="text-sm font-medium text-text-primary">{stats.conversions.visitToBooking.rate}%</span>
            </div>
          </div>
          <div className="bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.conversions.visitToBooking.rate}%` }}
            />
          </div>
        </div>

        <div className="bg-background-secondary rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Negotiation Success</span>
            <div className="flex items-center space-x-1">
              <Icon name={getTrendIcon(stats.conversions.negotiationSuccess.trend)} size={12} className={getTrendColor(stats.conversions.negotiationSuccess.trend)} />
              <span className="text-sm font-medium text-text-primary">{stats.conversions.negotiationSuccess.rate}%</span>
            </div>
          </div>
          <div className="bg-secondary-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.conversions.negotiationSuccess.rate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Average Time in Stage */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Avg. Time in Stage</h4>
        {stats.avgTimeInStage.map((item) => (
          <div key={item.stage} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <div className="flex items-center space-x-2">
              <Icon name={getStageIcon(item.stage)} size={14} className="text-secondary-600" />
              <span className="text-sm text-text-secondary">{item.stage}</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{item.days} days</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSidebar;