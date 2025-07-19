import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LeadProfileModal = ({ lead, isOpen, onClose, onUpdateLead }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead || {});

  if (!isOpen || !lead) return null;

  const interactionHistory = [
    {
      id: 1,
      type: 'call',
      date: '2024-01-15T10:30:00',
      duration: '5 min',
      notes: 'Initial contact made. Customer interested in 2BHK units. Scheduled site visit for next week.',
      outcome: 'positive'
    },
    {
      id: 2,
      type: 'whatsapp',
      date: '2024-01-16T14:20:00',
      message: 'Thank you for your interest in Skyline Residences. Here are the floor plans you requested.',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'email',
      date: '2024-01-17T09:15:00',
      subject: 'Skyline Residences - Pricing Details',
      status: 'opened'
    },
    {
      id: 4,
      type: 'call',
      date: '2024-01-18T16:45:00',
      duration: '8 min',
      notes: 'Follow-up call. Customer has budget concerns. Discussed payment plans and offers.',
      outcome: 'neutral'
    }
  ];

  const nurturingMessages = [
    {
      id: 1,
      week: 'Week 1',
      message: 'Welcome to Skyline Residences! Discover your dream home with us.',
      sentDate: '2024-01-15T09:00:00',
      status: 'delivered',
      opened: true
    },
    {
      id: 2,
      week: 'Week 1',
      message: 'Explore our premium amenities: Swimming pool, Gym, Kids play area & more!',
      sentDate: '2024-01-17T10:00:00',
      status: 'delivered',
      opened: true
    },
    {
      id: 3,
      week: 'Week 1',
      message: 'Limited time offer: Book now and save ₹2 lakhs! T&C apply.',
      sentDate: '2024-01-19T11:00:00',
      status: 'delivered',
      opened: false
    },
    {
      id: 4,
      week: 'Week 2',
      message: 'Schedule your site visit today. Available slots: Weekends 10 AM - 6 PM',
      sentDate: '2024-01-22T09:30:00',
      status: 'pending'
    }
  ];

  const handleSave = () => {
    onUpdateLead(editedLead);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedLead({ ...editedLead, [field]: value });
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'whatsapp': return 'MessageCircle';
      case 'email': return 'Mail';
      case 'meeting': return 'Users';
      default: return 'MessageSquare';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-error';
      case 'neutral': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-foreground">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{lead.name}</h2>
              <p className="text-text-secondary">{lead.project} • {lead.source}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              iconName={isEditing ? 'Check' : 'Edit'}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
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
            {[
              { id: 'overview', label: 'Overview', icon: 'User' },
              { id: 'interactions', label: 'Interactions', icon: 'MessageSquare' },
              { id: 'nurturing', label: 'Nurturing', icon: 'Zap' },
              { id: 'notes', label: 'Notes', icon: 'FileText' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editedLead.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <p className="text-text-primary">{lead.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editedLead.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <p className="text-text-primary">{lead.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedLead.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="text-text-primary">{lead.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-primary">Lead Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'qualified' ? 'bg-success-100 text-success-700' :
                        lead.status === 'nurturing' ? 'bg-purple-100 text-purple-700' :
                        lead.status === 'new'? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Source</label>
                      <p className="text-text-primary">{lead.source}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Project</label>
                      <p className="text-text-primary">{lead.project}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Assigned To</label>
                      <p className="text-text-primary">{lead.assignedTo || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Budget Range</label>
                    <p className="text-text-primary">₹45 - 55 Lakhs</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Unit Type</label>
                    <p className="text-text-primary">2 BHK</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Timeline</label>
                    <p className="text-text-primary">3-6 months</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Interaction History</h3>
                <Button variant="primary" size="sm" iconName="Plus">
                  Add Interaction
                </Button>
              </div>
              
              <div className="space-y-4">
                {interactionHistory.map((interaction) => (
                  <div key={interaction.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-background-secondary rounded-lg">
                        <Icon name={getInteractionIcon(interaction.type)} size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-text-primary capitalize">
                              {interaction.type}
                            </span>
                            {interaction.duration && (
                              <span className="text-sm text-text-secondary">
                                ({interaction.duration})
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-text-secondary">
                            {formatDateTime(interaction.date)}
                          </span>
                        </div>
                        
                        {interaction.notes && (
                          <p className="text-text-primary mb-2">{interaction.notes}</p>
                        )}
                        
                        {interaction.message && (
                          <p className="text-text-primary mb-2 italic">"{interaction.message}"</p>
                        )}
                        
                        {interaction.subject && (
                          <p className="text-text-primary mb-2 font-medium">{interaction.subject}</p>
                        )}
                        
                        {interaction.outcome && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            interaction.outcome === 'positive' ? 'bg-success-100 text-success-700' :
                            interaction.outcome === 'negative'? 'bg-error-100 text-error-700' : 'bg-warning-100 text-warning-700'
                          }`}>
                            {interaction.outcome.charAt(0).toUpperCase() + interaction.outcome.slice(1)}
                          </span>
                        )}
                        
                        {interaction.status && (
                          <span className="text-sm text-text-secondary">
                            Status: {interaction.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nurturing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Nurturing Campaign</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Progress:</span>
                  <div className="w-32 bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${lead.nurturingProgress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {lead.nurturingProgress || 0}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {nurturingMessages.map((message) => (
                  <div key={message.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary">{message.week}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          message.status === 'delivered' ? 'bg-success-100 text-success-700' :
                          message.status === 'pending'? 'bg-warning-100 text-warning-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {message.status}
                        </span>
                        {message.opened && (
                          <Icon name="Eye" size={14} className="text-success" />
                        )}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {formatDateTime(message.sentDate)}
                      </span>
                    </div>
                    <p className="text-text-primary">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Notes & Comments</h3>
                <Button variant="primary" size="sm" iconName="Plus">
                  Add Note
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary">John Doe</span>
                    <span className="text-sm text-text-secondary">15/01/2024, 10:30 AM</span>
                  </div>
                  <p className="text-text-primary">
                    Customer is very interested in the 2BHK unit on the 8th floor. 
                    Mentioned they need to discuss with spouse before making a decision. 
                    Follow up scheduled for next week.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary">Sarah Smith</span>
                    <span className="text-sm text-text-secondary">18/01/2024, 4:45 PM</span>
                  </div>
                  <p className="text-text-primary">
                    Discussed payment plans and financing options. Customer is concerned about 
                    the down payment amount. Shared details about our flexible payment schemes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadProfileModal;