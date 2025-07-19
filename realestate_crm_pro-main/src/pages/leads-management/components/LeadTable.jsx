import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Input from '../../../components/ui/Input';

const LeadTable = ({ leads, onLeadSelect, onBulkAction, selectedLeads, onSelectAll, onLeadAction }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [actionDropdown, setActionDropdown] = useState(null);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-700',
      'contacted': 'bg-yellow-100 text-yellow-700',
      'qualified': 'bg-green-100 text-green-700',
      'nurturing': 'bg-purple-100 text-purple-700',
      'disqualified': 'bg-red-100 text-red-700',
      'converted': 'bg-emerald-100 text-emerald-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getNurturingStage = (stage) => {
    const stages = {
      'week1': 'Week 1 (3 msgs)',
      'week2': 'Week 2 (2 msgs)',
      'week3-4': 'Week 3-4 (1 weekly)',
      'month2': 'Month 2+ (bi-weekly)',
      'month3': 'Month 3+ (monthly)',
      'paused': 'Paused',
      'completed': 'Completed'
    };
    return stages[stage] || 'Not Started';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    return phone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
  };

  const handleActionClick = (leadId, action) => {
    onLeadAction(leadId, action);
    setActionDropdown(null);
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Input
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={onSelectAll} />

              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Lead Details</span>
                  <Icon name={getSortIcon('name')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('source')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Source</span>
                  <Icon name={getSortIcon('source')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('project')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Project</span>
                  <Icon name={getSortIcon('project')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assignedTo')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Assigned To</span>
                  <Icon name={getSortIcon('assignedTo')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('nurturingStage')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Nurturing Stage</span>
                  <Icon name={getSortIcon('nurturingStage')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('lastContact')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary hover:text-text-primary">

                  <span>Last Contact</span>
                  <Icon name={getSortIcon('lastContact')} size={12} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) =>
            <tr key={lead.id} className="hover:bg-background-secondary transition-colors duration-200">
                <td className="px-4 py-3">
                  <Input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => onLeadSelect(lead.id)} />

                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <button
                    onClick={() => onLeadAction(lead.id, 'view-profile')}
                    className="text-sm font-medium text-primary hover:text-primary-600 text-left">

                      {lead.name}
                    </button>
                    <div className="text-xs text-text-secondary space-y-1">
                      <div className="flex items-center space-x-1">
                        <Icon name="Phone" size={12} />
                        <span>{formatPhone(lead.phone)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Mail" size={12} />
                        <span>{lead.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-text-primary">{lead.source}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-text-primary">{lead.project}</span>
                </td>
                <td className="px-4 py-3">
                  {lead.assignedTo ?
                <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {lead.assignedTo.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-text-primary">{lead.assignedTo}</span>
                    </div> :

                <span className="text-sm text-text-secondary">Unassigned</span>
                }
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary">{getNurturingStage(lead.nurturingStage)}</span>
                    {lead.nurturingProgress &&
                  <div className="mt-1">
                        <div className="w-full bg-secondary-200 rounded-full h-1">
                          <div
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${lead.nurturingProgress}%` }}>
                      </div>
                        </div>
                        <span className="text-xs text-text-secondary">{lead.nurturingProgress}% complete</span>
                      </div>
                  }
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary">{formatDate(lead.lastContact)}</span>
                    <span className="text-xs text-text-secondary">{lead.lastContactType}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                    onClick={() => setActionDropdown(actionDropdown === lead.id ? null : lead.id)}
                    className="p-1 hover:bg-background-secondary rounded transition-colors duration-200">

                      <Icon name="MoreVertical" size={16} />
                    </button>
                    
                    {actionDropdown === lead.id &&
                  <div className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                        onClick={() => handleActionClick(lead.id, 'call')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary">

                            <Icon name="Phone" size={14} />
                            <span>Log Call</span>
                          </button>
                          <button
                        onClick={() => handleActionClick(lead.id, 'whatsapp')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary">

                            <Icon name="MessageCircle" size={14} />
                            <span>Send WhatsApp</span>
                          </button>
                          <button
                        onClick={() => handleActionClick(lead.id, 'qualify')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary">

                            <Icon name="CheckCircle" size={14} />
                            <span>Update Status</span>
                          </button>
                          <button
                        onClick={() => handleActionClick(lead.id, 'convert')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary">

                            <Icon name="ArrowRight" size={14} />
                            <span>Convert to Opportunity</span>
                          </button>
                          <button
                        onClick={() => handleActionClick(lead.id, 'assign')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary">

                            <Icon name="UserPlus" size={14} />
                            <span>Reassign</span>
                          </button>
                        </div>
                      </div>
                  }
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {leads.length === 0 &&
      <div className="p-8 text-center">
          <Icon name="Users" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No leads found</h3>
          <p className="text-text-secondary">Try adjusting your filters or import new leads to get started.</p>
        </div>
      }
    </div>);

};

export default LeadTable;