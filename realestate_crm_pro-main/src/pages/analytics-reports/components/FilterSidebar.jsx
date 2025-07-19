import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterSidebar = ({ filters, onFiltersChange, onExport }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const teamMembers = [
    { id: 'all', name: 'All Team Members' },
    { id: 'john', name: 'John Smith' },
    { id: 'sarah', name: 'Sarah Johnson' },
    { id: 'mike', name: 'Mike Wilson' },
    { id: 'emma', name: 'Emma Davis' },
    { id: 'alex', name: 'Alex Brown' }
  ];

  const projects = [
    { id: 'all', name: 'All Projects' },
    { id: 'skyline', name: 'Skyline Residences' },
    { id: 'marina', name: 'Marina Heights' },
    { id: 'garden', name: 'Garden View Apartments' },
    { id: 'downtown', name: 'Downtown Plaza' }
  ];

  const reportTypes = [
    { id: 'leads', label: 'Lead Analytics', checked: true },
    { id: 'opportunities', label: 'Opportunity Analytics', checked: true },
    { id: 'visits', label: 'Site Visit Analytics', checked: true },
    { id: 'whatsapp', label: 'WhatsApp Analytics', checked: false },
    { id: 'team', label: 'Team Performance', checked: true }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReportTypeToggle = (reportId) => {
    const updatedTypes = filters.reportTypes.map(type =>
      type.id === reportId ? { ...type, checked: !type.checked } : type
    );
    handleFilterChange('reportTypes', updatedTypes);
  };

  return (
    <div className={`bg-surface border-r border-border transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'} flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <h3 className="text-lg font-semibold text-text-primary">Filters & Reports</h3>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {filters.dateRange === 'custom' && (
              <div className="mt-3 space-y-2">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Team Member Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Team Member
            </label>
            <select
              value={filters.teamMember}
              onChange={(e) => handleFilterChange('teamMember', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Project
            </label>
            <select
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Types */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Report Types
            </label>
            <div className="space-y-2">
              {reportTypes.map(type => (
                <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={type.checked}
                    onChange={() => handleReportTypeToggle(type.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-primary">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Export Reports
            </label>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('pdf')}
                className="w-full justify-start"
                iconName="FileText"
                iconPosition="left"
              >
                Export as PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('excel')}
                className="w-full justify-start"
                iconName="Download"
                iconPosition="left"
              >
                Export as Excel
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-border">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Quick Actions
            </label>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange('reset', true)}
                className="w-full justify-start text-text-secondary"
                iconName="RotateCcw"
                iconPosition="left"
              >
                Reset Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-text-secondary"
                iconName="Bookmark"
                iconPosition="left"
              >
                Save Filter Set
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;