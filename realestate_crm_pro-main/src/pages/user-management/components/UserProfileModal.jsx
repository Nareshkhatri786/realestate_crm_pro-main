import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserProfileModal = ({ user, isOpen, onClose, onSave, onDelete }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || '',
    department: user?.department || '',
    status: user?.status || 'active',
    projects: user?.projects || []
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'projects', label: 'Projects', icon: 'Building2' }
  ];

  const permissions = [
    { id: 'leads_view', label: 'View Leads', granted: true },
    { id: 'leads_create', label: 'Create Leads', granted: true },
    { id: 'leads_edit', label: 'Edit Leads', granted: true },
    { id: 'leads_delete', label: 'Delete Leads', granted: false },
    { id: 'opportunities_view', label: 'View Opportunities', granted: true },
    { id: 'opportunities_create', label: 'Create Opportunities', granted: true },
    { id: 'opportunities_edit', label: 'Edit Opportunities', granted: true },
    { id: 'opportunities_delete', label: 'Delete Opportunities', granted: false },
    { id: 'site_visits_view', label: 'View Site Visits', granted: true },
    { id: 'site_visits_create', label: 'Create Site Visits', granted: true },
    { id: 'analytics_view', label: 'View Analytics', granted: true },
    { id: 'user_management', label: 'User Management', granted: false },
    { id: 'campaigns_view', label: 'View Campaigns', granted: true },
    { id: 'campaigns_create', label: 'Create Campaigns', granted: false }
  ];

  const activities = [
    { id: 1, type: 'login', message: 'Logged in', timestamp: new Date(Date.now() - 300000) },
    { id: 2, type: 'lead', message: 'Added new lead: Rajesh Kumar', timestamp: new Date(Date.now() - 1800000) },
    { id: 3, type: 'opportunity', message: 'Updated opportunity: Priya Sharma', timestamp: new Date(Date.now() - 3600000) },
    { id: 4, type: 'site_visit', message: 'Completed site visit for Amit Patel', timestamp: new Date(Date.now() - 7200000) },
    { id: 5, type: 'logout', message: 'Logged out', timestamp: new Date(Date.now() - 86400000) }
  ];

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
      department: user?.department || '',
      status: user?.status || 'active',
      projects: user?.projects || []
    });
    setIsEditing(false);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return 'LogIn';
      case 'logout': return 'LogOut';
      case 'lead': return 'UserPlus';
      case 'opportunity': return 'Target';
      case 'site_visit': return 'MapPin';
      default: return 'Activity';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-radius-lg sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-medium text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
                <p className="text-text-secondary">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  iconName="Edit"
                >
                  Edit
                </Button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-background-secondary rounded-md transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-text-secondary">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-text-secondary">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-text-secondary">{user.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Role
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="telecaller">Telecaller</option>
                        <option value="sales_executive">Sales Executive</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <p className="text-text-secondary">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="sales">Sales</option>
                        <option value="marketing">Marketing</option>
                        <option value="admin">Admin</option>
                        <option value="operations">Operations</option>
                      </select>
                    ) : (
                      <p className="text-text-secondary">{user.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Status
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <p className="text-text-secondary">{user.status}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Access Permissions</h3>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-radius">
                      <span className="text-sm font-medium text-text-primary">{permission.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          permission.granted ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
                        }`}>
                          {permission.granted ? 'Granted' : 'Denied'}
                        </span>
                        <Icon 
                          name={permission.granted ? 'Check' : 'X'} 
                          size={16} 
                          className={permission.granted ? 'text-success' : 'text-error'} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Recent Activity</h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-background-secondary rounded-radius">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Icon name={getActivityIcon(activity.type)} size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{activity.message}</p>
                        <p className="text-xs text-text-secondary">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Project Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.projects?.map((project, index) => (
                    <div key={index} className="p-4 bg-background-secondary rounded-radius">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-text-primary">{project}</h4>
                        <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(user)}
                iconName="Trash2"
                className="text-error hover:text-error-700"
              >
                Delete User
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Key"
              >
                Reset Password
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;