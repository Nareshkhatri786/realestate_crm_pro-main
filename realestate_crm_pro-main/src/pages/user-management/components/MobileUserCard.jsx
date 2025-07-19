import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileUserCard = ({ user, onUserSelect, onUserEdit, onUserDelete, className = '' }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-error-100 text-error-700';
      case 'project_manager':
        return 'bg-warning-100 text-warning-700';
      case 'sales_executive':
        return 'bg-primary-100 text-primary-700';
      case 'telecaller':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'bg-success-100 text-success-700' :'bg-error-100 text-error-700';
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    const date = new Date(lastLogin);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-surface border border-border rounded-radius-md p-4 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-lg font-medium text-primary-foreground">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <button
              onClick={() => onUserSelect?.(user)}
              className="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              {user.name}
            </button>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUserEdit?.(user)}
            iconName="Edit"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUserDelete?.(user)}
            iconName="Trash2"
            className="text-error hover:text-error-700"
          />
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Phone:</span>
          <span className="text-sm font-medium text-text-primary">{user.phone}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Role:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Department:</span>
          <span className="text-sm font-medium text-text-primary capitalize">{user.department}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Last Login:</span>
          <span className="text-sm font-medium text-text-primary">{formatLastLogin(user.lastLogin)}</span>
        </div>
      </div>

      {/* Projects */}
      {user.projects && user.projects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-sm text-text-secondary">Projects:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.projects.slice(0, 2).map((project, index) => (
              <span key={index} className="text-xs bg-background-secondary text-text-primary px-2 py-1 rounded">
                {project}
              </span>
            ))}
            {user.projects.length > 2 && (
              <span className="text-xs text-text-muted">
                +{user.projects.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={14} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">
            {user.projects?.length || 0} project{user.projects?.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-200">
            View Profile
          </button>
          <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-200">
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileUserCard;