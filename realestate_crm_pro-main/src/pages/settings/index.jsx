import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import FieldManager from '../../components/ui/FieldManager';
import TemplateBuilder from '../../components/ui/TemplateBuilder';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('whatsapp');
  const [settings, setSettings] = useState({});
  const [templates, setTemplates] = useState([]);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const tabs = [
    { id: 'whatsapp', label: 'WhatsApp API', icon: 'MessageCircle' },
    { id: 'fields', label: 'Custom Fields', icon: 'Settings' },
    { id: 'templates', label: 'Templates', icon: 'FileText' },
    { id: 'general', label: 'General', icon: 'Cog' }
  ];

  useEffect(() => {
    loadSettings();
    loadTemplates();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage (in production, this would be an API call)
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Default settings
      setSettings({
        whatsapp_api_token: '',
        whatsapp_phone_number_id: '',
        company_name: 'Real Estate Pro',
        company_address: '',
        default_agent_name: '',
        notification_preferences: {
          email: true,
          push: true,
          whatsapp: false
        }
      });
    }
  };

  const loadTemplates = () => {
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('whatsapp_templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  };

  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
  };

  const saveTemplate = (templateData) => {
    let updatedTemplates;
    
    if (editingTemplate) {
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t
      );
    } else {
      const newTemplate = {
        id: `template_${Date.now()}`,
        ...templateData,
        createdAt: new Date(),
        createdBy: 'Current User'
      };
      updatedTemplates = [newTemplate, ...templates];
    }
    
    setTemplates(updatedTemplates);
    localStorage.setItem('whatsapp_templates', JSON.stringify(updatedTemplates));
    setShowTemplateBuilder(false);
    setEditingTemplate(null);
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('whatsapp_templates', JSON.stringify(updatedTemplates));
  };

  const testWhatsAppConnection = async () => {
    if (!settings.whatsapp_api_token || !settings.whatsapp_phone_number_id) {
      alert('Please configure WhatsApp API credentials first');
      return;
    }

    try {
      // Test API connection by fetching templates
      const response = await fetch(`https://app.waofficial.com/api/integration/whatsapp-message/${settings.whatsapp_phone_number_id}/templates`, {
        headers: {
          'Authorization': `Bearer ${settings.whatsapp_api_token}`
        }
      });

      if (response.ok) {
        alert('WhatsApp API connection successful!');
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (error) {
      alert(`WhatsApp API connection failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="section-padding page-padding">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
              <p className="text-text-secondary">
                Configure your CRM system preferences and integrations
              </p>
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
              {activeTab === 'whatsapp' && (
                <WhatsAppSettings
                  settings={settings}
                  onSave={saveSettings}
                  onTest={testWhatsAppConnection}
                />
              )}
              
              {activeTab === 'fields' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Custom Fields Management</h3>
                    <p className="text-text-secondary">
                      Configure custom fields for leads, properties, and contacts to capture specific information relevant to your business.
                    </p>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-medium text-text-primary mb-4">Lead Fields</h4>
                      <FieldManager entityType="lead" />
                    </div>
                    
                    <div className="border-t border-border pt-8">
                      <h4 className="text-lg font-medium text-text-primary mb-4">Property Fields</h4>
                      <FieldManager entityType="property" />
                    </div>
                    
                    <div className="border-t border-border pt-8">
                      <h4 className="text-lg font-medium text-text-primary mb-4">Contact Fields</h4>
                      <FieldManager entityType="contact" />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'templates' && (
                <div>
                  {showTemplateBuilder ? (
                    <TemplateBuilder
                      template={editingTemplate}
                      onSave={saveTemplate}
                      onCancel={() => {
                        setShowTemplateBuilder(false);
                        setEditingTemplate(null);
                      }}
                    />
                  ) : (
                    <TemplateManagement
                      templates={templates}
                      onEdit={(template) => {
                        setEditingTemplate(template);
                        setShowTemplateBuilder(true);
                      }}
                      onDelete={deleteTemplate}
                      onCreate={() => setShowTemplateBuilder(true)}
                    />
                  )}
                </div>
              )}
              
              {activeTab === 'general' && (
                <GeneralSettings
                  settings={settings}
                  onSave={saveSettings}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// WhatsApp Settings Component
const WhatsAppSettings = ({ settings, onSave, onTest }) => {
  const [formData, setFormData] = useState({
    whatsapp_api_token: settings.whatsapp_api_token || '',
    whatsapp_phone_number_id: settings.whatsapp_phone_number_id || '',
    whatsapp_business_name: settings.whatsapp_business_name || '',
    auto_reply_enabled: settings.auto_reply_enabled || false,
    business_hours_start: settings.business_hours_start || '09:00',
    business_hours_end: settings.business_hours_end || '18:00'
  });

  const handleSave = () => {
    onSave(formData);
    alert('WhatsApp settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">WhatsApp Business API</h3>
        <p className="text-text-secondary">
          Configure your WhatsApp Business API credentials and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              API Access Token *
            </label>
            <input
              type="password"
              value={formData.whatsapp_api_token}
              onChange={(e) => setFormData({ ...formData, whatsapp_api_token: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your WhatsApp API token"
            />
            <p className="text-xs text-text-secondary mt-1">
              Get this from your WhatsApp Business API provider
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone Number ID *
            </label>
            <input
              type="text"
              value={formData.whatsapp_phone_number_id}
              onChange={(e) => setFormData({ ...formData, whatsapp_phone_number_id: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter phone number ID"
            />
            <p className="text-xs text-text-secondary mt-1">
              Unique identifier for your WhatsApp business phone number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Business Display Name
            </label>
            <input
              type="text"
              value={formData.whatsapp_business_name}
              onChange={(e) => setFormData({ ...formData, whatsapp_business_name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your business name on WhatsApp"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-text-primary mb-4">Business Hours</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.business_hours_start}
                  onChange={(e) => setFormData({ ...formData, business_hours_start: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.business_hours_end}
                  onChange={(e) => setFormData({ ...formData, business_hours_end: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="auto_reply"
              checked={formData.auto_reply_enabled}
              onChange={(e) => setFormData({ ...formData, auto_reply_enabled: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="auto_reply" className="text-sm font-medium text-text-primary">
              Enable auto-reply for after hours messages
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-6 border-t border-border">
        <Button
          variant="outline"
          iconName="TestTube"
          onClick={onTest}
        >
          Test Connection
        </Button>
        <Button
          variant="primary"
          iconName="Save"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

// Template Management Component
const TemplateManagement = ({ templates, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || template.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'text-success bg-success-100';
      case 'pending': return 'text-warning bg-warning-100';
      case 'draft': return 'text-text-secondary bg-background';
      case 'rejected': return 'text-error bg-error-100';
      default: return 'text-text-secondary bg-background';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">WhatsApp Templates</h3>
          <p className="text-text-secondary">
            Manage your WhatsApp business message templates
          </p>
        </div>
        <Button
          variant="primary"
          iconName="Plus"
          onClick={onCreate}
        >
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Templates List */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-radius-md">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h5 className="text-lg font-medium text-text-primary mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No templates found' : 'No templates yet'}
          </h5>
          <p className="text-text-secondary mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first WhatsApp message template to get started'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button
              variant="primary"
              iconName="Plus"
              onClick={onCreate}
            >
              Create First Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-text-primary">{template.name}</h4>
                  <p className="text-sm text-text-secondary">{template.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(template.status)}`}>
                  {template.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-text-secondary mb-2">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables?.slice(0, 3).map(variable => (
                    <span key={variable} className="text-xs bg-background border border-border px-2 py-1 rounded">
                      {variable}
                    </span>
                  ))}
                  {template.variables?.length > 3 && (
                    <span className="text-xs text-text-secondary">
                      +{template.variables.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-text-secondary">
                  {new Date(template.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit"
                    onClick={() => onEdit(template)}
                    title="Edit template"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => onDelete(template.id)}
                    title="Delete template"
                    className="text-error hover:text-error"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// General Settings Component
const GeneralSettings = ({ settings, onSave }) => {
  const [formData, setFormData] = useState({
    company_name: settings.company_name || '',
    company_address: settings.company_address || '',
    default_agent_name: settings.default_agent_name || '',
    time_zone: settings.time_zone || 'Asia/Kolkata',
    date_format: settings.date_format || 'DD/MM/YYYY',
    currency: settings.currency || 'INR',
    notification_preferences: settings.notification_preferences || {
      email: true,
      push: true,
      whatsapp: false
    }
  });

  const handleSave = () => {
    onSave(formData);
    alert('General settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">General Settings</h3>
        <p className="text-text-secondary">
          Configure your company information and system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Company Address
            </label>
            <textarea
              value={formData.company_address}
              onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Your company address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Default Agent Name
            </label>
            <input
              type="text"
              value={formData.default_agent_name}
              onChange={(e) => setFormData({ ...formData, default_agent_name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Default sales agent name"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time Zone
            </label>
            <select
              value={formData.time_zone}
              onChange={(e) => setFormData({ ...formData, time_zone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="Asia/Dubai">Asia/Dubai (UAE)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Format
              </label>
              <select
                value={formData.date_format}
                onChange={(e) => setFormData({ ...formData, date_format: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-text-primary mb-3">Notification Preferences</h4>
            <div className="space-y-3">
              {Object.entries(formData.notification_preferences).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      notification_preferences: {
                        ...formData.notification_preferences,
                        [key]: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor={key} className="text-sm font-medium text-text-primary capitalize">
                    {key} notifications
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button
          variant="primary"
          iconName="Save"
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;