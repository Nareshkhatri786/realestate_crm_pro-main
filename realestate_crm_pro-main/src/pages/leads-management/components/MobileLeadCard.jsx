import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileLeadCard = ({ lead, onLeadSelect, onLeadAction, isSelected }) => {
  const [showActions, setShowActions] = useState(false);

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

  const handleActionClick = (action) => {
    onLeadAction(lead.id, action);
    setShowActions(false);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 transition-all duration-200 ${
      isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onLeadSelect(lead.id)}
            className="mt-1"
          />
          <div className="flex-1">
            <button
              onClick={() => onLeadAction(lead.id, 'view-profile')}
              className="text-left"
            >
              <h3 className="font-semibold text-text-primary hover:text-primary transition-colors duration-200">
                {lead.name}
              </h3>
            </button>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
              <span className="text-xs text-text-secondary">{lead.source}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-background-secondary rounded-md transition-colors duration-200"
        >
          <Icon name="MoreVertical" size={16} />
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Phone" size={14} />
          <span>{formatPhone(lead.phone)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Mail" size={14} />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Building2" size={14} />
          <span>{lead.project}</span>
        </div>
      </div>

      {/* Assignment & Last Contact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {lead.assignedTo ? (
            <>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-foreground">
                  {lead.assignedTo.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm text-text-primary">{lead.assignedTo}</span>
            </>
          ) : (
            <span className="text-sm text-text-secondary">Unassigned</span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-text-primary">{formatDate(lead.lastContact)}</div>
          <div className="text-xs text-text-secondary">{lead.lastContactType}</div>
        </div>
      </div>

      {/* Nurturing Progress */}
      {lead.nurturingProgress && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-secondary">Nurturing Progress</span>
            <span className="text-xs font-medium text-text-primary">{lead.nurturingProgress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${lead.nurturingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleActionClick('call')}
          iconName="Phone"
          className="flex-1"
        >
          Call
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleActionClick('whatsapp')}
          iconName="MessageCircle"
          className="flex-1"
        >
          WhatsApp
        </Button>
      </div>

      {/* Action Dropdown */}
      {showActions && (
        <div className="absolute right-4 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleActionClick('qualify')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
            >
              <Icon name="CheckCircle" size={14} />
              <span>Update Status</span>
            </button>
            <button
              onClick={() => handleActionClick('convert')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
            >
              <Icon name="ArrowRight" size={14} />
              <span>Convert to Opportunity</span>
            </button>
            <button
              onClick={() => handleActionClick('assign')}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary"
            >
              <Icon name="UserPlus" size={14} />
              <span>Reassign</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLeadCard;