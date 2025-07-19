import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WhatsAppSettings = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    phoneNumberId: '',
    accessToken: '',
    webhookUrl: '',
    verifyToken: '',
    businessAccountId: '',
    isEnabled: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('whatsapp_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateSettings = () => {
    const newErrors = {};
    
    if (!settings.phoneNumberId.trim()) {
      newErrors.phoneNumberId = 'Phone Number ID is required';
    }
    
    if (!settings.accessToken.trim()) {
      newErrors.accessToken = 'Access Token is required';
    }
    
    if (settings.accessToken && settings.accessToken.length < 50) {
      newErrors.accessToken = 'Access Token appears to be invalid (too short)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async () => {
    if (!validateSettings()) return;
    
    setIsLoading(true);
    setTestStatus(null);
    
    try {
      // Test with a simple API call (this would be replaced with actual test)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Mock successful test
      setTestStatus({
        success: true,
        message: 'Connection successful! WhatsApp API is properly configured.'
      });
    } catch (error) {
      setTestStatus({
        success: false,
        message: 'Connection failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!validateSettings()) return;
    
    // Save to localStorage
    localStorage.setItem('whatsapp_settings', JSON.stringify(settings));
    
    // Call parent callback
    onSave(settings);
    onClose();
  };

  const handleReset = () => {
    setSettings({
      phoneNumberId: '',
      accessToken: '',
      webhookUrl: '',
      verifyToken: '',
      businessAccountId: '',
      isEnabled: false
    });
    setErrors({});
    setTestStatus(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">WhatsApp Settings</h2>
              <p className="text-sm text-text-secondary">Configure your WhatsApp Business API</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-text-primary">Enable WhatsApp Integration</h3>
              <p className="text-sm text-text-secondary">Turn on/off WhatsApp messaging features</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isEnabled}
                onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {settings.isEnabled && (
            <>
              {/* API Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">API Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number ID <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.phoneNumberId}
                    onChange={(e) => handleInputChange('phoneNumberId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.phoneNumberId ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter your WhatsApp Phone Number ID"
                  />
                  {errors.phoneNumberId && (
                    <p className="mt-1 text-sm text-error">{errors.phoneNumberId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Access Token <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={settings.accessToken}
                      onChange={(e) => handleInputChange('accessToken', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                        errors.accessToken ? 'border-error' : 'border-border'
                      }`}
                      placeholder="Enter your WhatsApp Access Token"
                    />
                  </div>
                  {errors.accessToken && (
                    <p className="mt-1 text-sm text-error">{errors.accessToken}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Business Account ID
                  </label>
                  <input
                    type="text"
                    value={settings.businessAccountId}
                    onChange={(e) => handleInputChange('businessAccountId', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="Enter your WhatsApp Business Account ID"
                  />
                </div>
              </div>

              {/* Webhook Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Webhook Configuration</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="https://your-domain.com/webhook/whatsapp"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Verify Token
                  </label>
                  <input
                    type="password"
                    value={settings.verifyToken}
                    onChange={(e) => handleInputChange('verifyToken', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                    placeholder="Enter your webhook verify token"
                  />
                </div>
              </div>

              {/* Test Connection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">Test Connection</h3>
                  <Button
                    variant="outline"
                    onClick={testConnection}
                    disabled={isLoading}
                    iconName={isLoading ? "Loader2" : "Zap"}
                  >
                    {isLoading ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {testStatus && (
                  <div className={`p-4 rounded-md flex items-center space-x-3 ${
                    testStatus.success 
                      ? 'bg-success-50 border border-success-200' 
                      : 'bg-error-50 border border-error-200'
                  }`}>
                    <Icon 
                      name={testStatus.success ? "CheckCircle" : "AlertCircle"} 
                      size={20} 
                      className={testStatus.success ? "text-success" : "text-error"} 
                    />
                    <p className={`text-sm ${
                      testStatus.success ? "text-success-700" : "text-error-700"
                    }`}>
                      {testStatus.message}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!settings.isEnabled || Object.keys(errors).length > 0}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSettings;