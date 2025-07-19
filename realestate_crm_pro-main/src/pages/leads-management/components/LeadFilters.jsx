import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LeadFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const leadSources = [
    { id: 'housing', name: 'Housing.com' },
    { id: 'magicbricks', name: 'MagicBricks' },
    { id: 'website', name: 'Website' },
    { id: 'referral', name: 'Referral' },
    { id: 'walk-in', name: 'Walk-in' },
    { id: 'social-media', name: 'Social Media' }
  ];

  const leadStatuses = [
    { id: 'new', name: 'New', color: 'bg-blue-100 text-blue-700' },
    { id: 'contacted', name: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'qualified', name: 'Qualified', color: 'bg-green-100 text-green-700' },
    { id: 'nurturing', name: 'Nurturing', color: 'bg-purple-100 text-purple-700' },
    { id: 'disqualified', name: 'Disqualified', color: 'bg-red-100 text-red-700' },
    { id: 'converted', name: 'Converted', color: 'bg-emerald-100 text-emerald-700' }
  ];

  const projects = [
    { id: 'skyline', name: 'Skyline Residences' },
    { id: 'marina', name: 'Marina Heights' },
    { id: 'garden', name: 'Garden View Apartments' },
    { id: 'downtown', name: 'Downtown Plaza' }
  ];

  const campaigns = [
    { id: 'summer-2024', name: 'Summer Campaign 2024' },
    { id: 'festive-offer', name: 'Festive Offer' },
    { id: 'early-bird', name: 'Early Bird Special' },
    { id: 'referral-bonus', name: 'Referral Bonus' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (key, value) => {
    const currentValues = filters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [key]: newValues });
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-background-secondary rounded transition-colors duration-200"
            >
              <Icon name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} size={16} />
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Search Leads
            </label>
            <Input
              type="search"
              placeholder="Search by name, phone, email..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Lead Source */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Lead Source
            </label>
            <div className="space-y-2">
              {leadSources.map((source) => (
                <label key={source.id} className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={(filters.sources || []).includes(source.id)}
                    onChange={() => handleMultiSelectChange('sources', source.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-text-primary">{source.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Project
            </label>
            <div className="space-y-2">
              {projects.map((project) => (
                <label key={project.id} className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={(filters.projects || []).includes(project.id)}
                    onChange={() => handleMultiSelectChange('projects', project.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-text-primary">{project.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Status
            </label>
            <div className="space-y-2">
              {leadStatuses.map((status) => (
                <label key={status.id} className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={(filters.statuses || []).includes(status.id)}
                    onChange={() => handleMultiSelectChange('statuses', status.id)}
                    className="mr-2"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                    {status.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              <Input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full"
              />
              <Input
                type="date"
                placeholder="To Date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Campaign Tags */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Campaign Tags
            </label>
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <label key={campaign.id} className="flex items-center">
                  <Input
                    type="checkbox"
                    checked={(filters.campaigns || []).includes(campaign.id)}
                    onChange={() => handleMultiSelectChange('campaigns', campaign.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-text-primary">{campaign.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assignment Status */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              Assignment Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <Input
                  type="checkbox"
                  checked={(filters.assignment || []).includes('assigned')}
                  onChange={() => handleMultiSelectChange('assignment', 'assigned')}
                  className="mr-2"
                />
                <span className="text-sm text-text-primary">Assigned</span>
              </label>
              <label className="flex items-center">
                <Input
                  type="checkbox"
                  checked={(filters.assignment || []).includes('unassigned')}
                  onChange={() => handleMultiSelectChange('assignment', 'unassigned')}
                  className="mr-2"
                />
                <span className="text-sm text-text-primary">Unassigned</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFilters;