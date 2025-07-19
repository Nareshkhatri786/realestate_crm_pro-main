import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { whatsappApi, templateApi } from '../../../api';

const MessageSender = ({ isOpen, onClose, recipients = [], onSendComplete }) => {
  const [messageType, setMessageType] = useState('text'); // 'text', 'template', 'media'
  const [message, setMessage] = useState({
    text: '',
    templateId: '',
    templateVariables: {},
    mediaUrl: '',
    mediaType: 'image',
    caption: ''
  });
  
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variableValues, setVariableValues] = useState({});
  const [preview, setPreview] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    updatePreview();
  }, [messageType, message, selectedTemplate, variableValues]);

  const loadTemplates = async () => {
    try {
      const response = await templateApi.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const updatePreview = () => {
    let previewText = '';
    
    switch (messageType) {
      case 'text':
        previewText = message.text;
        break;
      case 'template':
        if (selectedTemplate) {
          previewText = generateTemplatePreview();
        }
        break;
      case 'media':
        previewText = `[${message.mediaType.toUpperCase()}]\n${message.caption || 'Media attachment'}`;
        break;
      default:
        previewText = '';
    }
    
    setPreview(previewText);
  };

  const generateTemplatePreview = () => {
    if (!selectedTemplate) return '';
    
    let text = '';
    selectedTemplate.components.forEach(component => {
      if (component.type === 'HEADER' && component.text) {
        text += `📢 ${component.text}\n\n`;
      } else if (component.type === 'BODY') {
        text += `${component.text}\n\n`;
      } else if (component.type === 'FOOTER') {
        text += `${component.text}`;
      }
    });

    // Replace variables with actual values
    Object.keys(variableValues).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      text = text.replace(regex, variableValues[key] || `{{${key}}}`);
    });

    return text;
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    setMessage(prev => ({ ...prev, templateId }));
    
    // Initialize variable values
    if (template) {
      const variables = {};
      template.components.forEach(component => {
        if (component.text) {
          const matches = component.text.match(/{{(\w+)}}/g) || [];
          matches.forEach(match => {
            const varName = match.replace(/[{}]/g, '');
            variables[varName] = '';
          });
        }
      });
      setVariableValues(variables);
    }
  };

  const handleVariableChange = (variable, value) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const validateMessage = () => {
    const newErrors = {};
    
    if (recipients.length === 0) {
      newErrors.recipients = 'No recipients selected';
    }
    
    switch (messageType) {
      case 'text':
        if (!message.text.trim()) {
          newErrors.text = 'Message text is required';
        }
        break;
      case 'template':
        if (!message.templateId) {
          newErrors.template = 'Please select a template';
        }
        
        // Check if all variables are filled
        Object.keys(variableValues).forEach(key => {
          if (!variableValues[key].trim()) {
            newErrors.variables = 'All template variables must be filled';
          }
        });
        break;
      case 'media':
        if (!message.mediaUrl.trim()) {
          newErrors.mediaUrl = 'Media URL is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendMessages = async () => {
    if (!validateMessage()) return;
    
    setIsSending(true);
    setSendResults(null);
    
    try {
      // Get WhatsApp settings
      const settings = JSON.parse(localStorage.getItem('whatsapp_settings') || '{}');
      
      if (!settings.phoneNumberId || !settings.accessToken) {
        throw new Error('WhatsApp API not configured. Please check settings.');
      }
      
      let results;
      
      switch (messageType) {
        case 'text':
          results = await whatsappApi.sendBulkMessages(
            settings.phoneNumberId,
            recipients.map(r => ({ phone: r.phone, variables: {} })),
            message.text,
            settings.accessToken
          );
          break;
          
        case 'template':
          // Send template messages individually for variable substitution
          const templateResults = [];
          for (const recipient of recipients) {
            try {
              const result = await whatsappApi.sendTemplateMessage(
                settings.phoneNumberId,
                {
                  to: recipient.phone,
                  templateName: selectedTemplate.name,
                  languageCode: selectedTemplate.language,
                  components: buildTemplateComponents(recipient)
                },
                settings.accessToken
              );
              
              templateResults.push({
                recipient: recipient.phone,
                success: result.success,
                messageId: result.messageId,
                error: result.error
              });
            } catch (error) {
              templateResults.push({
                recipient: recipient.phone,
                success: false,
                error: error.message
              });
            }
          }
          
          results = {
            success: true,
            results: templateResults,
            total: recipients.length,
            successful: templateResults.filter(r => r.success).length,
            failed: templateResults.filter(r => !r.success).length
          };
          break;
          
        case 'media':
          // Send media messages individually
          const mediaResults = [];
          for (const recipient of recipients) {
            try {
              const result = await whatsappApi.sendMediaMessage(
                settings.phoneNumberId,
                recipient.phone,
                {
                  type: message.mediaType,
                  url: message.mediaUrl,
                  caption: message.caption
                },
                settings.accessToken
              );
              
              mediaResults.push({
                recipient: recipient.phone,
                success: result.success,
                messageId: result.messageId,
                error: result.error
              });
            } catch (error) {
              mediaResults.push({
                recipient: recipient.phone,
                success: false,
                error: error.message
              });
            }
          }
          
          results = {
            success: true,
            results: mediaResults,
            total: recipients.length,
            successful: mediaResults.filter(r => r.success).length,
            failed: mediaResults.filter(r => !r.success).length
          };
          break;
      }
      
      setSendResults(results);
      
      if (onSendComplete) {
        onSendComplete(results);
      }
      
    } catch (error) {
      setSendResults({
        success: false,
        error: error.message,
        total: recipients.length,
        successful: 0,
        failed: recipients.length
      });
    } finally {
      setIsSending(false);
    }
  };

  const buildTemplateComponents = (recipient) => {
    const components = [];
    
    selectedTemplate.components.forEach(component => {
      if (component.type === 'HEADER' && component.format === 'TEXT') {
        components.push({
          type: 'header',
          parameters: [{
            type: 'text',
            text: replaceVariables(component.text, recipient)
          }]
        });
      } else if (component.type === 'BODY') {
        const bodyVariables = extractVariables(component.text);
        components.push({
          type: 'body',
          parameters: bodyVariables.map(variable => ({
            type: 'text',
            text: getVariableValue(variable, recipient)
          }))
        });
      }
    });
    
    return components;
  };

  const extractVariables = (text) => {
    const matches = text.match(/{{(\w+)}}/g) || [];
    return matches.map(match => match.replace(/[{}]/g, ''));
  };

  const getVariableValue = (variable, recipient) => {
    // First check custom variable values
    if (variableValues[variable]) {
      return variableValues[variable];
    }
    
    // Then check recipient data
    if (recipient[variable]) {
      return recipient[variable];
    }
    
    // Default fallback
    return `{{${variable}}}`;
  };

  const replaceVariables = (text, recipient) => {
    let result = text;
    Object.keys(variableValues).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      const value = getVariableValue(key, recipient);
      result = result.replace(regex, value);
    });
    return result;
  };

  const resetForm = () => {
    setMessageType('text');
    setMessage({
      text: '',
      templateId: '',
      templateVariables: {},
      mediaUrl: '',
      mediaType: 'image',
      caption: ''
    });
    setSelectedTemplate(null);
    setVariableValues({});
    setErrors({});
    setSendResults(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Send" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Send WhatsApp Message</h2>
              <p className="text-sm text-text-secondary">
                Sending to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-180px)]">
          {/* Message Composer */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Message Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Message Type</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: 'text', label: 'Text Message', icon: 'MessageSquare' },
                    { type: 'template', label: 'Template', icon: 'FileText' },
                    { type: 'media', label: 'Media', icon: 'Image' }
                  ].map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setMessageType(option.type)}
                      className={`p-4 border rounded-md flex flex-col items-center space-y-2 transition-colors duration-200 ${
                        messageType === option.type
                          ? 'border-primary bg-primary-50 text-primary'
                          : 'border-border hover:border-primary-200'
                      }`}
                    >
                      <Icon name={option.icon} size={24} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Message Content</h3>
                
                {messageType === 'text' && (
                  <div>
                    <textarea
                      value={message.text}
                      onChange={(e) => setMessage(prev => ({ ...prev, text: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none ${
                        errors.text ? 'border-error' : 'border-border'
                      }`}
                      rows={6}
                      placeholder="Enter your message..."
                    />
                    {errors.text && (
                      <p className="mt-1 text-sm text-error">{errors.text}</p>
                    )}
                  </div>
                )}

                {messageType === 'template' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Select Template
                      </label>
                      <select
                        value={message.templateId}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                          errors.template ? 'border-error' : 'border-border'
                        }`}
                      >
                        <option value="">Choose a template...</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </option>
                        ))}
                      </select>
                      {errors.template && (
                        <p className="mt-1 text-sm text-error">{errors.template}</p>
                      )}
                    </div>

                    {selectedTemplate && Object.keys(variableValues).length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Template Variables
                        </label>
                        <div className="space-y-3">
                          {Object.keys(variableValues).map((variable) => (
                            <div key={variable}>
                              <label className="block text-xs font-medium text-text-secondary mb-1">
                                {variable}
                              </label>
                              <input
                                type="text"
                                value={variableValues[variable]}
                                onChange={(e) => handleVariableChange(variable, e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                                placeholder={`Enter value for ${variable}`}
                              />
                            </div>
                          ))}
                        </div>
                        {errors.variables && (
                          <p className="mt-1 text-sm text-error">{errors.variables}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {messageType === 'media' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Media Type
                      </label>
                      <select
                        value={message.mediaType}
                        onChange={(e) => setMessage(prev => ({ ...prev, mediaType: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="image">Image</option>
                        <option value="document">Document</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Media URL
                      </label>
                      <input
                        type="url"
                        value={message.mediaUrl}
                        onChange={(e) => setMessage(prev => ({ ...prev, mediaUrl: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                          errors.mediaUrl ? 'border-error' : 'border-border'
                        }`}
                        placeholder="https://example.com/media.jpg"
                      />
                      {errors.mediaUrl && (
                        <p className="mt-1 text-sm text-error">{errors.mediaUrl}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Caption (Optional)
                      </label>
                      <textarea
                        value={message.caption}
                        onChange={(e) => setMessage(prev => ({ ...prev, caption: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
                        rows={3}
                        placeholder="Enter media caption..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Send Results */}
              {sendResults && (
                <div className={`p-4 rounded-md ${
                  sendResults.success ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon 
                      name={sendResults.success ? "CheckCircle" : "AlertCircle"} 
                      size={20} 
                      className={sendResults.success ? "text-success" : "text-error"} 
                    />
                    <h4 className={`font-medium ${
                      sendResults.success ? "text-success-700" : "text-error-700"
                    }`}>
                      {sendResults.success ? 'Messages Sent' : 'Send Failed'}
                    </h4>
                  </div>
                  {sendResults.success ? (
                    <div className="text-sm text-success-700">
                      <p>Successfully sent: {sendResults.successful}/{sendResults.total} messages</p>
                      {sendResults.failed > 0 && (
                        <p>Failed: {sendResults.failed} messages</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-error-700">{sendResults.error}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-80 p-6 bg-background-secondary border-l border-border">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Preview</h3>
              
              <div className="bg-white rounded-md p-4 border border-border min-h-64">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="MessageCircle" size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">WhatsApp</span>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {preview || 'Configure your message to see preview...'}
                  </pre>
                </div>
              </div>

              {/* Recipients List */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Recipients</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="text-sm text-text-secondary flex items-center space-x-2">
                      <Icon name="User" size={14} />
                      <span>{recipient.name}</span>
                      <span className="text-text-muted">({recipient.phone})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>Messages will be sent via WhatsApp Business API</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={sendMessages}
              disabled={isSending || Object.keys(errors).length > 0}
              iconName={isSending ? "Loader2" : "Send"}
            >
              {isSending ? 'Sending...' : 'Send Messages'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSender;