import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import whatsappApiService from '../../api/whatsappApi';

const TemplateBuilder = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'MARKETING',
    language: template?.language || 'en',
    components: template?.components || [],
    variables: template?.variables || [],
    status: template?.status || 'DRAFT'
  });

  const [previewData, setPreviewData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // Template categories
  const categories = [
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'UTILITY', label: 'Utility' },
    { value: 'AUTHENTICATION', label: 'Authentication' }
  ];

  // Component types
  const componentTypes = [
    { value: 'HEADER', label: 'Header', icon: 'Header' },
    { value: 'BODY', label: 'Body', icon: 'FileText' },
    { value: 'FOOTER', label: 'Footer', icon: 'AlignBottom' },
    { value: 'BUTTONS', label: 'Buttons', icon: 'MousePointer' }
  ];

  // Header formats
  const headerFormats = [
    { value: 'TEXT', label: 'Text' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'VIDEO', label: 'Video' },
    { value: 'DOCUMENT', label: 'Document' }
  ];

  // Button types
  const buttonTypes = [
    { value: 'QUICK_REPLY', label: 'Quick Reply' },
    { value: 'URL', label: 'URL' },
    { value: 'PHONE_NUMBER', label: 'Phone Number' }
  ];

  // Variable library
  const variableLibrary = [
    {
      category: 'Client Data',
      variables: [
        { name: 'client_name', label: 'Client Name', example: 'John Doe' },
        { name: 'client_phone', label: 'Client Phone', example: '+91 9876543210' },
        { name: 'client_email', label: 'Client Email', example: 'john@example.com' },
        { name: 'client_budget', label: 'Client Budget', example: '₹50L - ₹1Cr' },
        { name: 'client_location', label: 'Client Location', example: 'Mumbai' }
      ]
    },
    {
      category: 'Property Info',
      variables: [
        { name: 'property_name', label: 'Property Name', example: 'Skyline Residences' },
        { name: 'property_location', label: 'Property Location', example: 'Bandra West' },
        { name: 'property_price', label: 'Property Price', example: '₹1.2Cr' },
        { name: 'property_size', label: 'Property Size', example: '1200 sqft' },
        { name: 'property_type', label: 'Property Type', example: '2BHK Apartment' },
        { name: 'property_features', label: 'Property Features', example: 'Sea View, Parking' }
      ]
    },
    {
      category: 'Company Details',
      variables: [
        { name: 'company_name', label: 'Company Name', example: 'Real Estate Pro' },
        { name: 'agent_name', label: 'Agent Name', example: 'Sarah Johnson' },
        { name: 'agent_phone', label: 'Agent Phone', example: '+91 9876543210' },
        { name: 'office_address', label: 'Office Address', example: 'Mumbai Office' },
        { name: 'website', label: 'Website', example: 'www.realestatepro.com' }
      ]
    },
    {
      category: 'Appointment Info',
      variables: [
        { name: 'appointment_date', label: 'Appointment Date', example: 'Tomorrow' },
        { name: 'appointment_time', label: 'Appointment Time', example: '3:00 PM' },
        { name: 'site_visit_location', label: 'Site Visit Location', example: 'Project Location' },
        { name: 'meeting_link', label: 'Meeting Link', example: 'https://meet.google.com/abc-def-ghi' }
      ]
    }
  ];

  useEffect(() => {
    // Set sample data for preview
    const sampleData = {};
    variableLibrary.forEach(category => {
      category.variables.forEach(variable => {
        sampleData[variable.name] = variable.example;
      });
    });
    setPreviewData(sampleData);
  }, []);

  const addComponent = (type) => {
    const newComponent = {
      id: `component_${Date.now()}`,
      type: type,
      text: '',
      format: type === 'HEADER' ? 'TEXT' : undefined,
      buttons: type === 'BUTTONS' ? [] : undefined
    };

    setFormData({
      ...formData,
      components: [...formData.components, newComponent]
    });
  };

  const updateComponent = (componentId, updates) => {
    setFormData({
      ...formData,
      components: formData.components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    });
  };

  const removeComponent = (componentId) => {
    setFormData({
      ...formData,
      components: formData.components.filter(comp => comp.id !== componentId)
    });
  };

  const addButton = (componentId) => {
    const component = formData.components.find(comp => comp.id === componentId);
    if (component && component.buttons.length < 3) {
      const newButton = {
        id: `button_${Date.now()}`,
        type: 'QUICK_REPLY',
        text: ''
      };

      updateComponent(componentId, {
        buttons: [...component.buttons, newButton]
      });
    }
  };

  const updateButton = (componentId, buttonId, updates) => {
    const component = formData.components.find(comp => comp.id === componentId);
    if (component) {
      const updatedButtons = component.buttons.map(button =>
        button.id === buttonId ? { ...button, ...updates } : button
      );
      updateComponent(componentId, { buttons: updatedButtons });
    }
  };

  const removeButton = (componentId, buttonId) => {
    const component = formData.components.find(comp => comp.id === componentId);
    if (component) {
      const updatedButtons = component.buttons.filter(button => button.id !== buttonId);
      updateComponent(componentId, { buttons: updatedButtons });
    }
  };

  const insertVariable = (componentId, variableName) => {
    const component = formData.components.find(comp => comp.id === componentId);
    if (component) {
      const currentText = component.text || '';
      const newText = currentText + `{{${variableName}}}`;
      updateComponent(componentId, { text: newText });
    }
  };

  const validateTemplate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    const bodyComponent = formData.components.find(comp => comp.type === 'BODY');
    if (!bodyComponent || !bodyComponent.text.trim()) {
      newErrors.body = 'Template must have a body with content';
    }

    // Check for variables in template
    const variables = extractVariables();
    if (variables.length > 10) {
      newErrors.variables = 'Template can have maximum 10 variables';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const extractVariables = () => {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables = new Set();

    formData.components.forEach(component => {
      if (component.text) {
        let match;
        while ((match = variableRegex.exec(component.text)) !== null) {
          variables.add(match[1]);
        }
      }
    });

    return Array.from(variables);
  };

  const handleSave = () => {
    if (validateTemplate()) {
      const variables = extractVariables();
      const templateData = {
        ...formData,
        variables: variables,
        updatedAt: new Date()
      };
      onSave(templateData);
    }
  };

  const renderPreview = () => {
    const replaceVariables = (text) => {
      if (!text) return text;
      let replacedText = text;
      Object.keys(previewData).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        replacedText = replacedText.replace(regex, previewData[key]);
      });
      return replacedText;
    };

    return (
      <div className="bg-background border border-border rounded-radius-md p-4">
        <div className="bg-white rounded-radius-md p-4 shadow-sm max-w-sm mx-auto">
          {/* WhatsApp Message Bubble */}
          <div className="bg-green-500 text-white rounded-lg p-3 relative">
            {formData.components
              .sort((a, b) => {
                const order = { HEADER: 0, BODY: 1, FOOTER: 2, BUTTONS: 3 };
                return order[a.type] - order[b.type];
              })
              .map(component => (
                <div key={component.id} className="mb-2 last:mb-0">
                  {component.type === 'HEADER' && (
                    <div className="font-semibold text-sm mb-2">
                      {component.format === 'TEXT' ? (
                        replaceVariables(component.text)
                      ) : (
                        <div className="bg-white bg-opacity-20 rounded p-2 text-center">
                          [{component.format}]
                        </div>
                      )}
                    </div>
                  )}
                  
                  {component.type === 'BODY' && (
                    <div className="text-sm leading-relaxed">
                      {replaceVariables(component.text)}
                    </div>
                  )}
                  
                  {component.type === 'FOOTER' && (
                    <div className="text-xs opacity-80 mt-2">
                      {replaceVariables(component.text)}
                    </div>
                  )}
                  
                  {component.type === 'BUTTONS' && component.buttons && (
                    <div className="mt-2 space-y-1">
                      {component.buttons.map(button => (
                        <div
                          key={button.id}
                          className="bg-white bg-opacity-20 rounded p-2 text-center text-sm cursor-pointer hover:bg-opacity-30"
                        >
                          {button.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            
            {/* Message tail */}
            <div className="absolute bottom-0 right-0 transform translate-y-1 translate-x-1">
              <div className="w-0 h-0 border-l-8 border-l-green-500 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
          
          {/* Message info */}
          <div className="text-xs text-text-secondary mt-2 text-right">
            {new Date().toLocaleTimeString()} ✓✓
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {template ? 'Edit Template' : 'Create WhatsApp Template'}
          </h3>
          <p className="text-text-secondary">
            Build professional WhatsApp business message templates with variables and media
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            iconName="Eye"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Builder */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-surface border border-border rounded-radius-md p-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Template Information</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-error' : 'border-border'
                  }`}
                  placeholder="e.g., welcome_message"
                />
                {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                    <option value="gu">Gujarati</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Components */}
          <div className="bg-surface border border-border rounded-radius-md">
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-text-primary">Message Components</h4>
                <div className="flex items-center space-x-2">
                  {componentTypes.map(type => (
                    <Button
                      key={type.value}
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      onClick={() => addComponent(type.value)}
                      disabled={
                        (type.value === 'HEADER' && formData.components.some(c => c.type === 'HEADER')) ||
                        (type.value === 'BODY' && formData.components.some(c => c.type === 'BODY')) ||
                        (type.value === 'FOOTER' && formData.components.some(c => c.type === 'FOOTER')) ||
                        (type.value === 'BUTTONS' && formData.components.some(c => c.type === 'BUTTONS'))
                      }
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              {formData.components.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="MessageSquare" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h5 className="text-lg font-medium text-text-primary mb-2">No Components</h5>
                  <p className="text-text-secondary mb-4">
                    Add components to build your WhatsApp message template
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.components
                    .sort((a, b) => {
                      const order = { HEADER: 0, BODY: 1, FOOTER: 2, BUTTONS: 3 };
                      return order[a.type] - order[b.type];
                    })
                    .map(component => (
                      <ComponentEditor
                        key={component.id}
                        component={component}
                        headerFormats={headerFormats}
                        buttonTypes={buttonTypes}
                        variableLibrary={variableLibrary}
                        onUpdate={updateComponent}
                        onRemove={removeComponent}
                        onAddButton={addButton}
                        onUpdateButton={updateButton}
                        onRemoveButton={removeButton}
                        onInsertVariable={insertVariable}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Variables Summary */}
          {extractVariables().length > 0 && (
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <h4 className="text-lg font-medium text-text-primary mb-4">Template Variables</h4>
              <div className="flex flex-wrap gap-2">
                {extractVariables().map(variable => (
                  <span
                    key={variable}
                    className="bg-primary-100 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {variable}
                  </span>
                ))}
              </div>
              {errors.variables && (
                <p className="text-sm text-error mt-2">{errors.variables}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              {template ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <h4 className="text-lg font-medium text-text-primary mb-4">Live Preview</h4>
              {renderPreview()}
            </div>

            {/* Variable Library */}
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <h4 className="text-lg font-medium text-text-primary mb-4">Variable Library</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {variableLibrary.map(category => (
                  <div key={category.category}>
                    <h5 className="font-medium text-text-primary mb-2">{category.category}</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {category.variables.map(variable => (
                        <div
                          key={variable.name}
                          className="flex items-center justify-between p-2 bg-background border border-border rounded-radius-sm"
                        >
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {variable.label}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {variable.example}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Copy"
                            onClick={() => {
                              navigator.clipboard.writeText(`{{${variable.name}}}`);
                            }}
                            title="Copy variable"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component Editor
const ComponentEditor = ({
  component,
  headerFormats,
  buttonTypes,
  variableLibrary,
  onUpdate,
  onRemove,
  onAddButton,
  onUpdateButton,
  onRemoveButton,
  onInsertVariable
}) => {
  const [showVariables, setShowVariables] = useState(false);

  return (
    <div className="border border-border rounded-radius-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon
            name={
              component.type === 'HEADER' ? 'Header' :
              component.type === 'BODY' ? 'FileText' :
              component.type === 'FOOTER' ? 'AlignBottom' : 'MousePointer'
            }
            size={16}
            className="text-primary"
          />
          <span className="font-medium text-text-primary">{component.type}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Variables"
            onClick={() => setShowVariables(!showVariables)}
            title="Insert variables"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={() => onRemove(component.id)}
            title="Remove component"
            className="text-error hover:text-error"
          />
        </div>
      </div>

      {/* Header Format Selection */}
      {component.type === 'HEADER' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Header Format
          </label>
          <select
            value={component.format || 'TEXT'}
            onChange={(e) => onUpdate(component.id, { format: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {headerFormats.map(format => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Text Content */}
      {component.type !== 'BUTTONS' && (component.format === 'TEXT' || !component.format) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Content {component.type === 'BODY' && '*'}
          </label>
          <textarea
            value={component.text || ''}
            onChange={(e) => onUpdate(component.id, { text: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={component.type === 'BODY' ? 4 : 2}
            placeholder={
              component.type === 'HEADER' ? 'Header text...' :
              component.type === 'BODY' ? 'Message body with variables like {{client_name}}...' :
              'Footer text...'
            }
          />
          <div className="text-xs text-text-secondary mt-1">
            Use {{variable_name}} to insert dynamic content
          </div>
        </div>
      )}

      {/* Media URL for non-text headers */}
      {component.type === 'HEADER' && component.format !== 'TEXT' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Media URL
          </label>
          <input
            type="url"
            value={component.url || ''}
            onChange={(e) => onUpdate(component.id, { url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {/* Buttons */}
      {component.type === 'BUTTONS' && (
        <div className="space-y-4">
          {component.buttons && component.buttons.map(button => (
            <div key={button.id} className="border border-border rounded-radius-sm p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">Button</span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onRemoveButton(component.id, button.id)}
                  className="text-error hover:text-error"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Type
                  </label>
                  <select
                    value={button.type}
                    onChange={(e) => onUpdateButton(component.id, button.id, { type: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {buttonTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Text
                  </label>
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => onUpdateButton(component.id, button.id, { text: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Button text"
                  />
                </div>
              </div>

              {/* URL or Phone Number for specific button types */}
              {(button.type === 'URL' || button.type === 'PHONE_NUMBER') && (
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    {button.type === 'URL' ? 'URL' : 'Phone Number'}
                  </label>
                  <input
                    type={button.type === 'URL' ? 'url' : 'tel'}
                    value={button.url || button.phone_number || ''}
                    onChange={(e) => onUpdateButton(component.id, button.id, 
                      button.type === 'URL' ? { url: e.target.value } : { phone_number: e.target.value }
                    )}
                    className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={button.type === 'URL' ? 'https://example.com' : '+91 9876543210'}
                  />
                </div>
              )}
            </div>
          ))}
          
          {(!component.buttons || component.buttons.length < 3) && (
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={() => onAddButton(component.id)}
            >
              Add Button
            </Button>
          )}
        </div>
      )}

      {/* Variable Insertion Panel */}
      {showVariables && (
        <div className="mt-4 border-t border-border pt-4">
          <h6 className="text-sm font-medium text-text-primary mb-3">Insert Variables</h6>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {variableLibrary.map(category => (
              <div key={category.category}>
                <div className="text-xs font-medium text-text-secondary mb-1">
                  {category.category}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {category.variables.map(variable => (
                    <button
                      key={variable.name}
                      onClick={() => onInsertVariable(component.id, variable.name)}
                      className="text-xs bg-background hover:bg-border text-left px-2 py-1 rounded border border-border"
                    >
                      {variable.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;