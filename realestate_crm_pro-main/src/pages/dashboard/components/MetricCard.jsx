import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = 'primary', 
  onClick,
  drillDownPath,
  drillDownFilter,
  loading = false,
  className = '' 
}) => {
  const navigate = useNavigate();

  const colorClasses = {
    primary: 'border-primary-200 bg-primary-50',
    success: 'border-success-200 bg-success-50',
    warning: 'border-warning-200 bg-warning-50',
    error: 'border-error-200 bg-error-50',
    secondary: 'border-secondary-200 bg-secondary-50'
  };

  const iconColorClasses = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
    secondary: 'text-secondary-600'
  };

  const trendColorClasses = {
    up: 'text-success-600',
    down: 'text-error-600',
    neutral: 'text-secondary-500'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (drillDownPath) {
      // Navigate to specific page with optional filter
      const path = drillDownFilter 
        ? `${drillDownPath}?filter=${encodeURIComponent(drillDownFilter)}`
        : drillDownPath;
      navigate(path);
    }
  };

  if (loading) {
    return (
      <div className={`card p-6 animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-secondary-200 rounded-lg"></div>
          <div className="w-16 h-4 bg-secondary-200 rounded"></div>
        </div>
        <div className="w-20 h-8 bg-secondary-200 rounded mb-2"></div>
        <div className="w-24 h-4 bg-secondary-200 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      className={`card p-6 transition-all duration-200 hover:shadow-md cursor-pointer relative group ${
        colorClasses[color]
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-surface ${iconColorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${trendColorClasses[trend]}`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {subtitle && (
          <p className="text-xs text-text-muted">{subtitle}</p>
        )}
      </div>

      {/* Drill-down indicator */}
      {(drillDownPath || onClick) && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="p-1 bg-surface rounded-md shadow-sm">
            <Icon name="ArrowUpRight" size={12} className="text-text-muted" />
          </div>
        </div>
      )}

      {/* Click to drill-down hint */}
      {(drillDownPath || onClick) && (
        <div className="absolute inset-x-0 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="text-center">
            <span className="text-xs text-text-muted bg-surface px-2 py-1 rounded-md shadow-sm">
              Click to view details
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;