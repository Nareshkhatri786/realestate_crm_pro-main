import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OpportunityModal = ({ opportunity, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');

  if (!isOpen || !opportunity) return null;

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Scheduled': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Visit Done': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'Negotiation': return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'Booking': return 'bg-success-100 text-success-700 border-success-200';
      case 'Lost': return 'bg-error-100 text-error-700 border-error-200';
      default: return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const handleAddNote = () => {
    if (notes.trim()) {
      const newNote = {
        id: Date.now(),
        content: notes,
        timestamp: new Date().toISOString(),
        author: 'Current User'
      };
      
      const updatedOpportunity = {
        ...opportunity,
        notes: [...(opportunity.notes || []), newNote]
      };
      
      onUpdate(updatedOpportunity);
      setNotes('');
    }
  };

  const handleScheduleFollowUp = () => {
    if (followUpDate && followUpTime) {
      const followUpDateTime = new Date(`${followUpDate}T${followUpTime}`);
      const updatedOpportunity = {
        ...opportunity,
        nextActionDate: followUpDateTime.toISOString(),
        nextAction: 'Scheduled follow-up call'
      };
      
      onUpdate(updatedOpportunity);
      setFollowUpDate('');
      setFollowUpTime('');
    }
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: 'User' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'notes', label: 'Notes', icon: 'FileText' },
    { id: 'documents', label: 'Documents', icon: 'Paperclip' }
  ];

  const mockTimeline = [
    { id: 1, type: 'stage_change', description: 'Moved to Negotiation stage', timestamp: '2024-01-15T10:30:00Z', user: 'John Doe' },
    { id: 2, type: 'site_visit', description: 'Site visit completed', timestamp: '2024-01-14T14:00:00Z', user: 'Sarah Smith' },
    { id: 3, type: 'call', description: 'Follow-up call made', timestamp: '2024-01-13T11:15:00Z', user: 'John Doe' },
    { id: 4, type: 'whatsapp', description: 'WhatsApp message sent', timestamp: '2024-01-12T09:45:00Z', user: 'System' },
    { id: 5, type: 'lead_assigned', description: 'Lead assigned to John Doe', timestamp: '2024-01-10T16:20:00Z', user: 'System' }
  ];

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'stage_change': return 'ArrowRight';
      case 'site_visit': return 'MapPin';
      case 'call': return 'Phone';
      case 'whatsapp': return 'MessageCircle';
      case 'lead_assigned': return 'UserPlus';
      default: return 'Circle';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-700">
                {opportunity.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{opportunity.clientName}</h2>
              <p className="text-text-secondary">{opportunity.phone} • {opportunity.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(opportunity.stage)}`}>
              {opportunity.stage}
            </span>
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Name</p>
                      <p className="font-medium text-text-primary">{opportunity.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Phone" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="font-medium text-text-primary">{opportunity.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Mail" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Email</p>
                      <p className="font-medium text-text-primary">{opportunity.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="MapPin" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Location</p>
                      <p className="font-medium text-text-primary">{opportunity.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Property Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Icon name="Building2" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Property Type</p>
                      <p className="font-medium text-text-primary">{opportunity.propertyType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="IndianRupee" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Budget</p>
                      <p className="font-medium text-text-primary">{formatCurrency(opportunity.budget)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="Calendar" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Next Action</p>
                      <p className="font-medium text-text-primary">{opportunity.nextAction}</p>
                      <p className="text-sm text-warning-600">
                        {new Date(opportunity.nextActionDate).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size={16} className="text-secondary-600" />
                    <div>
                      <p className="text-sm text-text-secondary">Assigned To</p>
                      <p className="font-medium text-text-primary">{opportunity.assignedTo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {mockTimeline.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-background-secondary rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={getTimelineIcon(item.type)} size={14} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-text-secondary">{item.user}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">
                          {new Date(item.timestamp).toLocaleDateString('en-GB')} at {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Notes & Follow-ups</h3>
              </div>
              
              {/* Add Note */}
              <div className="bg-background-secondary rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-3">Add Note</h4>
                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your note..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddNote}>
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Schedule Follow-up */}
              <div className="bg-background-secondary rounded-lg p-4">
                <h4 className="text-sm font-medium text-text-primary mb-3">Schedule Follow-up</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-3"
                  onClick={handleScheduleFollowUp}
                >
                  Schedule Follow-up
                </Button>
              </div>

              {/* Existing Notes */}
              <div className="space-y-3">
                {(opportunity.notes || []).map((note) => (
                  <div key={note.id} className="bg-surface border border-border rounded-lg p-3">
                    <p className="text-sm text-text-primary mb-2">{note.content}</p>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span>{note.author}</span>
                      <span>•</span>
                      <span>{new Date(note.timestamp).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Documents</h3>
                <Button variant="primary" size="sm" iconName="Upload">
                  Upload Document
                </Button>
              </div>
              
              <div className="text-center py-8">
                <Icon name="FileText" size={48} className="text-secondary-400 mx-auto mb-4" />
                <p className="text-text-secondary">No documents uploaded yet</p>
                <p className="text-sm text-text-muted mt-1">Upload property documents, agreements, or other files</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-background-secondary">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Phone">
              Call
            </Button>
            <Button variant="outline" size="sm" iconName="MessageSquare">
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" iconName="Mail">
              Email
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;