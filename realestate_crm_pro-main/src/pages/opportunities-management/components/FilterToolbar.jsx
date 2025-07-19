import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  onRefresh,
  totalOpportunities,
  filteredCount 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      executive: 'All Executives',
      propertyType: 'All Types',
      priority: 'All Priorities',
      aging: 'All Ages',
      dateRange: null
    });
  };

  const executives = ['All Executives', 'John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Davis', 'David Wilson'];
  const propertyTypes = ['All Types', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa'];
  const priorities = ['All Priorities', 'High', 'Medium', 'Low'];
  const agingOptions = ['All Ages', 'New (0-7 days)', 'Fresh (8-15 days)', 'Warm (16-30 days)', 'Cold (31-60 days)', 'Stale (60+ days)'];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      {/* Search Bar - Enhanced */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex-1 max-w-md mb-3 sm:mb-0">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
            <Input
              type="text"
              placeholder="Search by name, phone, or location..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Filter"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={clearFilters}
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Executive Filter */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Executive
            </label>
            <select
              value={filters.executive}
              onChange={(e) => handleFilterChange('executive', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {executives.map(exec => (
                <option key={exec} value={exec}>{exec}</option>
              ))}
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Aging Filter */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Aging
            </label>
            <select
              value={filters.aging}
              onChange={(e) => handleFilterChange('aging', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {agingOptions.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Filter Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <span>
            Showing <span className="font-semibold text-text-primary">{filteredCount}</span> of{' '}
            <span className="font-semibold text-text-primary">{totalOpportunities}</span> opportunities
          </span>
          
          {/* Active Filters Indicator */}
          {(filters.search || filters.executive !== 'All Executives' || filters.propertyType !== 'All Types' || 
            filters.priority !== 'All Priorities' || filters.aging !== 'All Ages') && (
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-primary-500" />
              <span className="text-primary-600 font-medium">Filters active</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={onExport}
          >
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;