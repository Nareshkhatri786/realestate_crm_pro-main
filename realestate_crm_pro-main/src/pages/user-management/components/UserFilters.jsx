import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserFilters = ({ onFiltersChange, totalUsers, className = '' }) => {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: '',
    project: '',
    lastLogin: '',
    search: ''
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const roles = [
    { value: 'admin', label: 'Admin', count: 3 },
    { value: 'project_manager', label: 'Project Manager', count: 8 },
    { value: 'sales_executive', label: 'Sales Executive', count: 25 },
    { value: 'telecaller', label: 'Telecaller', count: 15 }
  ];

  const statuses = [
    { value: 'active', label: 'Active', count: 45 },
    { value: 'inactive', label: 'Inactive', count: 6 }
  ];

  const departments = [
    { value: 'sales', label: 'Sales', count: 35 },
    { value: 'marketing', label: 'Marketing', count: 8 },
    { value: 'admin', label: 'Admin', count: 5 },
    { value: 'operations', label: 'Operations', count: 3 }
  ];

  const projects = [
    { value: 'skyline_residences', label: 'Skyline Residences', count: 28 },
    { value: 'marina_heights', label: 'Marina Heights', count: 22 },
    { value: 'garden_view', label: 'Garden View Apartments', count: 18 },
    { value: 'downtown_plaza', label: 'Downtown Plaza', count: 15 }
  ];

  const lastLoginOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'older', label: 'Older than 30 days' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      role: '',
      status: '',
      department: '',
      project: '',
      lastLogin: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className={`bg-surface border border-border rounded-radius-md ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-background-secondary rounded-md transition-colors duration-200 lg:hidden"
          >
            <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-4 ${isCollapsed ? 'hidden lg:block' : ''}`}>
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Search Users
          </label>
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Role
          </label>
          <div className="space-y-2">
            {roles.map((role) => (
              <label key={role.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={filters.role === role.value}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="form-radio text-primary"
                />
                <span className="text-sm text-text-primary">{role.label}</span>
                <span className="text-xs text-text-secondary">({role.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={filters.status === status.value}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-radio text-primary"
                />
                <span className="text-sm text-text-primary">{status.label}</span>
                <span className="text-xs text-text-secondary">({status.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label} ({dept.count})
              </option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Project Assignment
          </label>
          <select
            value={filters.project}
            onChange={(e) => handleFilterChange('project', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.value} value={project.value}>
                {project.label} ({project.count})
              </option>
            ))}
          </select>
        </div>

        {/* Last Login Filter */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Last Login
          </label>
          <select
            value={filters.lastLogin}
            onChange={(e) => handleFilterChange('lastLogin', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Any Time</option>
            {lastLoginOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;