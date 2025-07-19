import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LeadActionBar = ({ selectedLeads, onBulkAction, onImportLeads, onExportLeads }) => {
  const [bulkActionDropdown, setBulkActionDropdown] = useState(false);
  const [assignmentDropdown, setAssignmentDropdown] = useState(false);

  const teamMembers = [
    { id: 'john-doe', name: 'John Doe', role: 'Telecaller' },
    { id: 'sarah-smith', name: 'Sarah Smith', role: 'Sales Executive' },
    { id: 'mike-johnson', name: 'Mike Johnson', role: 'Telecaller' },
    { id: 'lisa-brown', name: 'Lisa Brown', role: 'Sales Executive' }
  ];

  const handleBulkAction = (action, data = null) => {
    onBulkAction(action, selectedLeads, data);
    setBulkActionDropdown(false);
    setAssignmentDropdown(false);
  };

  const handleAssignment = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    handleBulkAction('assign', member);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Left Section - Bulk Actions */}
        <div className="flex items-center space-x-4">
          {selectedLeads.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </span>
              
              {/* Bulk Actions Dropdown */}
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBulkActionDropdown(!bulkActionDropdown)}
                  iconName="ChevronDown"
                  iconPosition="right"
                >
                  Bulk Actions
                </Button>
                
                {bulkActionDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <button
                        onClick={() => setAssignmentDropdown(!assignmentDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon name="UserPlus" size={14} />
                          <span>Assign to Team Member</span>
                        </div>
                        <Icon name="ChevronRight" size={12} />
                      </button>
                      <button
                        onClick={() => handleBulkAction('update-status')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                      >
                        <Icon name="Edit" size={14} />
                        <span>Update Status</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('add-tags')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                      >
                        <Icon name="Tag" size={14} />
                        <span>Add Tags</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('start-nurturing')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                      >
                        <Icon name="MessageSquare" size={14} />
                        <span>Start Nurturing</span>
                      </button>
                      <button
                        onClick={() => handleBulkAction('export-selected')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                      >
                        <Icon name="Download" size={14} />
                        <span>Export Selected</span>
                      </button>
                      <div className="border-t border-border my-1"></div>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error-50"
                      >
                        <Icon name="Trash2" size={14} />
                        <span>Delete Selected</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Assignment Submenu */}
                {assignmentDropdown && (
                  <div className="absolute left-48 top-0 w-48 bg-surface border border-border rounded-md shadow-lg z-30">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wide border-b border-border">
                        Team Members
                      </div>
                      {teamMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleAssignment(member.id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-foreground">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-xs text-text-secondary">{member.role}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Primary Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportLeads}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onImportLeads}
            iconName="Upload"
            iconPosition="left"
          >
            Import Leads
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-text-primary">1,247</div>
            <div className="text-xs text-text-secondary">Total Leads</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">342</div>
            <div className="text-xs text-text-secondary">Qualified</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">156</div>
            <div className="text-xs text-text-secondary">In Nurturing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">89</div>
            <div className="text-xs text-text-secondary">Converted</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadActionBar;