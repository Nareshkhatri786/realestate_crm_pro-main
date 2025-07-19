import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CallTracker from '../../components/ui/CallTracker';
import InteractionLogger from '../../components/ui/InteractionLogger';
import whatsappApiService from '../../api/whatsappApi';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'interactions', label: 'Interactions', icon: 'Activity' },
    { id: 'calls', label: 'Call Logs', icon: 'Phone' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle' },
    { id: 'documents', label: 'Documents', icon: 'File' }
  ];

  useEffect(() => {
    loadLead();
    loadTemplates();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      // In production, this would be an API call
      const mockLead = {
        id: id,
        name: 'John Doe',
        phone: '+91 9876543210',
        email: 'john.doe@example.com',
        source: 'Website',
        project: 'Skyline Residences',
        assignedTo: 'Sarah Johnson',
        status: 'Hot Lead',
        nurturingStage: 'Property Viewing',
        nurturingProgress: 75,
        lastContact: '2 hours ago',
        lastContactType: 'WhatsApp',
        createdDate: '2024-01-15',
        budget: '₹50L - ₹1Cr',
        unitType: '2BHK',
        timeline: '3-6 months',
        followUpStatus: 'Scheduled',
        customFields: {
          preferred_location: 'Bandra West',
          family_size: '4 members',
          current_residence: 'Rental',
          occupation: 'Software Engineer',
          investment_purpose: 'End Use'
        }
      };
      setLead(mockLead);
    } catch (error) {
      console.error('Error loading lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem('whatsapp_templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  };

  const handleSendWhatsApp = async (templateId, variables = {}) => {
    try {
      const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
      const phoneNumberId = settings.whatsapp_phone_number_id;
      
      if (!phoneNumberId) {
        alert('Please configure WhatsApp settings first');
        return;
      }

      const template = templates.find(t => t.id === templateId);
      if (!template) {
        alert('Template not found');
        return;
      }

      // Personalize template with lead data
      const personalizedTemplate = {
        ...template,
        components: template.components.map(component => ({
          ...component,
          parameters: component.parameters?.map(param => ({
            ...param,
            text: variables[param.text] || param.text
          }))
        }))
      };

      const result = await whatsappApiService.sendTemplateMessage(
        phoneNumberId,
        lead.phone,
        personalizedTemplate
      );

      if (result.success) {
        // Log the interaction
        const messageLog = {
          id: `whatsapp_${Date.now()}`,
          contactId: lead.id,
          messageId: result.messageId,
          template: template.name,
          status: 'sent',
          timestamp: new Date(),
          direction: 'sent',
          createdBy: 'Current User'
        };

        // Save to localStorage
        const existingMessages = JSON.parse(localStorage.getItem(`whatsapp_messages_${lead.id}`) || '[]');
        existingMessages.unshift(messageLog);
        localStorage.setItem(`whatsapp_messages_${lead.id}`, JSON.stringify(existingMessages));

        alert('WhatsApp message sent successfully!');
        setShowMessageModal(false);
      } else {
        alert(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      alert('Failed to send WhatsApp message');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'hot lead': return 'bg-red-100 text-red-800';
      case 'warm lead': return 'bg-orange-100 text-orange-800';
      case 'cold lead': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="section-padding page-padding">
            <div className="text-center py-12">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading lead details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="section-padding page-padding">
            <div className="text-center py-12">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">Lead Not Found</h3>
              <p className="text-text-secondary mb-4">The lead you're looking for doesn't exist.</p>
              <Button variant="primary" onClick={() => navigate('/leads')}>
                Back to Leads
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="section-padding page-padding">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Button
                variant="ghost"
                iconName="ArrowLeft"
                onClick={() => navigate('/leads')}
              >
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{lead.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <span className="text-text-secondary">ID: {lead.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="MessageCircle"
                onClick={() => setShowMessageModal(true)}
              >
                Send WhatsApp
              </Button>
              <Button
                variant="outline"
                iconName="Edit"
                onClick={() => navigate(`/leads/${id}/edit`)}
              >
                Edit Lead
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-radius-md p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Phone" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Phone</p>
                  <p className="font-medium text-text-primary">{lead.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="Mail" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="font-medium text-text-primary">{lead.email}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                  <Icon name="Building" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Project</p>
                  <p className="font-medium text-text-primary">{lead.project}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-error" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Last Contact</p>
                  <p className="font-medium text-text-primary">{lead.lastContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-surface border border-border rounded-radius-md mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <LeadOverview lead={lead} />
              )}
              
              {activeTab === 'interactions' && (
                <InteractionLogger
                  entityId={lead.id}
                  entityType="lead"
                  entityName={lead.name}
                />
              )}
              
              {activeTab === 'calls' && (
                <CallTracker
                  contactId={lead.id}
                  contactPhone={lead.phone}
                  contactName={lead.name}
                />
              )}
              
              {activeTab === 'whatsapp' && (
                <WhatsAppChat
                  leadId={lead.id}
                  leadPhone={lead.phone}
                  leadName={lead.name}
                  onSendMessage={handleSendWhatsApp}
                />
              )}
              
              {activeTab === 'documents' && (
                <DocumentManager leadId={lead.id} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Send WhatsApp Modal */}
      {showMessageModal && (
        <WhatsAppMessageModal
          lead={lead}
          templates={templates}
          onSend={handleSendWhatsApp}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
};

// Lead Overview Component
const LeadOverview = ({ lead }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Source</p>
                <p className="font-medium text-text-primary">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Assigned To</p>
                <p className="font-medium text-text-primary">{lead.assignedTo}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Budget</p>
                <p className="font-medium text-text-primary">{lead.budget}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Unit Type</p>
                <p className="font-medium text-text-primary">{lead.unitType}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Timeline</p>
                <p className="font-medium text-text-primary">{lead.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Created Date</p>
                <p className="font-medium text-text-primary">{new Date(lead.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        {lead.customFields && Object.keys(lead.customFields).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Additional Information</h3>
            <div className="space-y-3">
              {Object.entries(lead.customFields).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-text-secondary capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="font-medium text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nurturing Progress */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Nurturing Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{lead.nurturingStage}</span>
                <span className="text-sm text-text-secondary">{lead.nurturingProgress}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${lead.nurturingProgress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-text-secondary">
              <p>Last contact: {lead.lastContact} via {lead.lastContactType}</p>
              <p>Follow-up status: {lead.followUpStatus}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background rounded-radius-md">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-sm text-text-secondary">Total Calls</p>
            </div>
            <div className="text-center p-4 bg-background rounded-radius-md">
              <p className="text-2xl font-bold text-success">12</p>
              <p className="text-sm text-text-secondary">WhatsApp Messages</p>
            </div>
            <div className="text-center p-4 bg-background rounded-radius-md">
              <p className="text-2xl font-bold text-warning">2</p>
              <p className="text-sm text-text-secondary">Site Visits</p>
            </div>
            <div className="text-center p-4 bg-background rounded-radius-md">
              <p className="text-2xl font-bold text-error">8</p>
              <p className="text-sm text-text-secondary">Email Interactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// WhatsApp Chat Component
const WhatsAppChat = ({ leadId, leadPhone, leadName, onSendMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, [leadId]);

  const loadMessages = () => {
    const savedMessages = localStorage.getItem(`whatsapp_messages_${leadId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  };

  const sendQuickMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
      const phoneNumberId = settings.whatsapp_phone_number_id;
      
      if (!phoneNumberId) {
        alert('Please configure WhatsApp settings first');
        return;
      }

      const result = await whatsappApiService.sendTextMessage(
        phoneNumberId,
        leadPhone,
        newMessage
      );

      if (result.success) {
        const messageLog = {
          id: `whatsapp_${Date.now()}`,
          contactId: leadId,
          messageId: result.messageId,
          content: newMessage,
          status: 'sent',
          timestamp: new Date(),
          direction: 'sent',
          createdBy: 'Current User'
        };

        const updatedMessages = [messageLog, ...messages];
        setMessages(updatedMessages);
        localStorage.setItem(`whatsapp_messages_${leadId}`, JSON.stringify(updatedMessages));
        setNewMessage('');
        
        alert('Message sent successfully!');
      } else {
        alert(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">WhatsApp Conversation</h3>
        <div className="text-sm text-text-secondary">
          {leadPhone}
        </div>
      </div>

      {/* Quick Message */}
      <div className="bg-background border border-border rounded-radius-md p-4">
        <h4 className="font-medium text-text-primary mb-3">Send Quick Message</h4>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendQuickMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            variant="primary"
            iconName="Send"
            onClick={sendQuickMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-surface border border-border rounded-radius-md">
        <div className="border-b border-border p-4">
          <h4 className="font-medium text-text-primary">Message History</h4>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="MessageCircle" size={48} className="text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No messages yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === 'sent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.direction === 'sent'
                        ? 'bg-primary text-white'
                        : 'bg-background border border-border text-text-primary'
                    }`}
                  >
                    <p className="text-sm">
                      {message.content?.text || message.template || 'Template message'}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.direction === 'sent' ? 'text-primary-100' : 'text-text-secondary'
                    }`}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Document Manager Component
const DocumentManager = ({ leadId }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Load documents (mock data)
    setDocuments([
      {
        id: '1',
        name: 'Property Brochure.pdf',
        type: 'application/pdf',
        size: '2.5 MB',
        uploadedAt: new Date('2024-01-15'),
        uploadedBy: 'Sarah Johnson'
      },
      {
        id: '2',
        name: 'Site Photos.zip',
        type: 'application/zip',
        size: '15.2 MB',
        uploadedAt: new Date('2024-01-14'),
        uploadedBy: 'John Smith'
      }
    ]);
  }, [leadId]);

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return 'FileText';
    if (type.includes('image')) return 'Image';
    if (type.includes('zip')) return 'Archive';
    return 'File';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Documents</h3>
        <Button variant="primary" iconName="Upload">
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-radius-md">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h5 className="text-lg font-medium text-text-primary mb-2">No Documents</h5>
          <p className="text-text-secondary mb-4">Upload documents related to this lead</p>
          <Button variant="primary" iconName="Upload">
            Upload First Document
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-4 bg-surface border border-border rounded-radius-md">
              <div className="flex items-center space-x-3">
                <Icon name={getFileIcon(doc.type)} size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-text-primary">{doc.name}</p>
                  <p className="text-sm text-text-secondary">
                    {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="Download" />
                <Button variant="ghost" size="sm" iconName="Trash2" className="text-error hover:text-error" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// WhatsApp Message Modal
const WhatsAppMessageModal = ({ lead, templates, onSend, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [messageType, setMessageType] = useState('template');

  const handleSend = () => {
    if (messageType === 'template' && selectedTemplate) {
      const variables = {
        client_name: lead.name,
        property_name: lead.project,
        agent_name: lead.assignedTo,
        company_name: 'Real Estate Pro'
      };
      onSend(selectedTemplate, variables);
    } else if (messageType === 'custom' && customMessage.trim()) {
      // For custom messages, we'd use the text message API
      onSend('custom', { message: customMessage });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-radius-lg max-w-md w-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text-primary">Send WhatsApp Message</h3>
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>
          <p className="text-text-secondary mt-1">To: {lead.name} ({lead.phone})</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Message Type
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="messageType"
                  value="template"
                  checked={messageType === 'template'}
                  onChange={(e) => setMessageType(e.target.value)}
                />
                <span>Template</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="messageType"
                  value="custom"
                  checked={messageType === 'custom'}
                  onChange={(e) => setMessageType(e.target.value)}
                />
                <span>Custom Message</span>
              </label>
            </div>
          </div>

          {messageType === 'template' ? (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.category})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Custom Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Type your message..."
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={
                (messageType === 'template' && !selectedTemplate) ||
                (messageType === 'custom' && !customMessage.trim())
              }
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;