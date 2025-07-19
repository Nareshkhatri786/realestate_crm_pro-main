import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignBuilder = ({ onSaveCampaign, className = '' }) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    audience: {
      type: 'all',
      filters: {},
      count: 0
    },
    workflow: [],
    schedule: {
      type: 'immediate',
      startDate: '',
      endDate: ''
    }
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const canvasRef = useRef(null);

  const templates = [
    {
      id: 1,
      name: 'Welcome Message',
      category: 'nurturing',
      content: 'Welcome to our real estate family! We are excited to help you find your dream property.',
      variables: ['name', 'property_type']
    },
    {
      id: 2,
      name: 'Property Update',
      category: 'property',
      content: 'New property alert! {{property_name}} in {{location}} is now available. Price: {{price}}',
      variables: ['property_name', 'location', 'price']
    },
    {
      id: 3,
      name: 'Site Visit Reminder',
      category: 'appointment',
      content: 'Hi {{name}}, reminder about your site visit tomorrow at {{time}} for {{property_name}}.',
      variables: ['name', 'time', 'property_name']
    },
    {
      id: 4,
      name: 'Follow-up Message',
      category: 'nurturing',
      content: 'Hi {{name}}, how was your experience visiting {{property_name}}? Any questions?',
      variables: ['name', 'property_name']
    },
    {
      id: 5,
      name: 'Payment Reminder',
      category: 'booking',
      content: 'Dear {{name}}, your payment for {{property_name}} is due on {{due_date}}.',
      variables: ['name', 'property_name', 'due_date']
    },
    {
      id: 6,
      name: 'Offer Expiry',
      category: 'promotional',
      content: 'Limited time offer on {{property_name}} expires in {{days}} days. Book now!',
      variables: ['property_name', 'days']
    }
  ];

  const audienceOptions = [
    { value: 'all', label: 'All Leads', count: 1245 },
    { value: 'new', label: 'New Leads (Last 7 days)', count: 89 },
    { value: 'hot', label: 'Hot Leads', count: 156 },
    { value: 'cold', label: 'Cold Leads', count: 234 },
    { value: 'site_visit', label: 'Site Visit Scheduled', count: 45 },
    { value: 'negotiation', label: 'In Negotiation', count: 67 },
    { value: 'custom', label: 'Custom Audience', count: 0 }
  ];

  const workflowNodes = [
    { type: 'message', icon: 'MessageCircle', label: 'Send Message' },
    { type: 'delay', icon: 'Clock', label: 'Wait/Delay' },
    { type: 'condition', icon: 'GitBranch', label: 'Condition' },
    { type: 'action', icon: 'Zap', label: 'Action' }
  ];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode = {
      id: Date.now(),
      type: draggedItem.type,
      x: x,
      y: y,
      data: {
        label: draggedItem.label,
        icon: draggedItem.icon,
        config: {}
      }
    };

    setCampaignData(prev => ({
      ...prev,
      workflow: [...prev.workflow, newNode]
    }));

    setDraggedItem(null);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleSaveCampaign = () => {
    if (!campaignData.name) {
      alert('Please enter a campaign name');
      return;
    }

    onSaveCampaign?.(campaignData);
    
    // Reset form
    setCampaignData({
      name: '',
      description: '',
      audience: { type: 'all', filters: {}, count: 0 },
      workflow: [],
      schedule: { type: 'immediate', startDate: '', endDate: '' }
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Campaign Details */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Campaign Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              value={campaignData.name}
              onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter campaign name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <input
              type="text"
              value={campaignData.description}
              onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description"
            />
          </div>
        </div>
      </div>

      {/* Audience Selection */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Target Audience</h3>
        <div className="space-y-3">
          {audienceOptions.map((option) => (
            <label key={option.value} className="flex items-center justify-between p-3 border border-border rounded-radius cursor-pointer hover:bg-background-secondary transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="audience"
                  value={option.value}
                  checked={campaignData.audience.type === option.value}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    audience: { ...campaignData.audience, type: e.target.value, count: option.count }
                  })}
                  className="form-radio text-primary"
                />
                <span className="text-sm font-medium text-text-primary">{option.label}</span>
              </div>
              <span className="text-sm text-text-secondary">{option.count} contacts</span>
            </label>
          ))}
        </div>
      </div>

      {/* Workflow Builder */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Campaign Workflow</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Template Library */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-medium text-text-primary mb-3">Message Templates</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-border rounded-radius cursor-pointer hover:bg-background-secondary transition-colors duration-200"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium text-text-primary">{template.name}</h5>
                    <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">{template.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-text-primary mb-3">Workflow Elements</h4>
              <div className="space-y-2">
                {workflowNodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node)}
                    className="flex items-center space-x-2 p-2 border border-border rounded-radius cursor-move hover:bg-background-secondary transition-colors duration-200"
                  >
                    <Icon name={node.icon} size={16} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-9">
            <div
              ref={canvasRef}
              className="h-96 bg-background-secondary border-2 border-dashed border-border rounded-radius-md relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {campaignData.workflow.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="MousePointer" size={48} className="mx-auto text-text-muted mb-4" />
                    <p className="text-text-secondary">Drag workflow elements here to build your campaign</p>
                  </div>
                </div>
              ) : (
                campaignData.workflow.map((node) => (
                  <div
                    key={node.id}
                    className="absolute bg-surface border border-border rounded-radius-md p-3 shadow-md"
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={node.data.icon} size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-primary">{node.data.label}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Schedule Campaign</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="schedule"
                value="immediate"
                checked={campaignData.schedule.type === 'immediate'}
                onChange={(e) => setCampaignData({
                  ...campaignData,
                  schedule: { ...campaignData.schedule, type: e.target.value }
                })}
                className="form-radio text-primary"
              />
              <span className="text-sm font-medium text-text-primary">Send Immediately</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="schedule"
                value="scheduled"
                checked={campaignData.schedule.type === 'scheduled'}
                onChange={(e) => setCampaignData({
                  ...campaignData,
                  schedule: { ...campaignData.schedule, type: e.target.value }
                })}
                className="form-radio text-primary"
              />
              <span className="text-sm font-medium text-text-primary">Schedule for Later</span>
            </label>
          </div>
          
          {campaignData.schedule.type === 'scheduled' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={campaignData.schedule.startDate}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    schedule: { ...campaignData.schedule, startDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={campaignData.schedule.endDate}
                  onChange={(e) => setCampaignData({
                    ...campaignData,
                    schedule: { ...campaignData.schedule, endDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3">
        <Button variant="outline">
          Save Draft
        </Button>
        <Button variant="primary" onClick={handleSaveCampaign}>
          Create Campaign
        </Button>
      </div>

      {/* Template Modal */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowTemplateModal(false)} />
            
            <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-radius-lg sm:align-middle">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">{selectedTemplate.name}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Message Content</label>
                    <textarea
                      value={selectedTemplate.content}
                      readOnly
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-radius text-sm bg-background-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Variables</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map((variable) => (
                        <span key={variable} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setShowTemplateModal(false)}>
                    Use Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilder;