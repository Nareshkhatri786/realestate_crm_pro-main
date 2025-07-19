import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { templateApi } from '../../../api';

const TemplateBuilder = ({ isOpen, onClose, onSave, editTemplate = null }) => {
  const [template, setTemplate] = useState({
    name: '',
    category: 'MARKETING',
    language: 'en',
    components: []
  });
  
  const [variables, setVariables] = useState([]);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [availableVariables] = useState([
    { key: 'name', label: 'Client Name', example: 'John Doe' },
    { key: 'property_name', label: 'Property Name', example: 'Skyline Residences' },
    { key: 'price', label: 'Price', example: '₹1.2Cr' },
    { key: 'unit_type', label: 'Unit Type', example: '2BHK' },
    { key: 'location', label: 'Location', example: 'Bandra West' },
    { key: 'agent_name', label: 'Agent Name', example: 'Sarah Smith' },
    { key: 'company_name', label: 'Company Name', example: 'RealEstate Pro' },
    { key: 'site_visit_time', label: 'Site Visit Time', example: '2:00 PM' },
    { key: 'contact_number', label: 'Contact Number', example: '+91 98765 43210' }
  ]);

  useEffect(() => {
    if (editTemplate) {
      setTemplate(editTemplate);
      extractVariables(editTemplate.components);
    }
  }, [editTemplate]);

  useEffect(() => {
    updatePreview();
  }, [template, variables]);

  const extractVariables = (components) => {
    const vars = [];
    components.forEach(component => {
      if (component.text) {
        const matches = component.text.match(/{{(\w+)}}/g) || [];
        matches.forEach(match => {
          const varName = match.replace(/[{}]/g, '');
          if (!vars.includes(varName)) {
            vars.push(varName);
          }
        });
      }
    });
    setVariables(vars);
  };

  const updatePreview = () => {
    let previewText = '';
    
    template.components.forEach(component => {
      if (component.type === 'HEADER' && component.text) {
        previewText += `📢 ${component.text}\n\n`;
      } else if (component.type === 'BODY') {
        previewText += `${component.text}\n\n`;
      } else if (component.type === 'FOOTER') {
        previewText += `${component.text}`;
      }
    });

    // Replace variables with examples
    availableVariables.forEach(variable => {
      const regex = new RegExp(`{{${variable.key}}}`, 'g');
      previewText = previewText.replace(regex, variable.example);
    });

    setPreview(previewText);
  };

  const handleTemplateChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComponentChange = (index, field, value) => {
    const newComponents = [...template.components];
    newComponents[index] = {
      ...newComponents[index],
      [field]: value
    };
    
    setTemplate(prev => ({
      ...prev,
      components: newComponents
    }));

    // Extract variables when text changes
    if (field === 'text') {
      extractVariables(newComponents);
    }
  };

  const addComponent = (type) => {
    const newComponent = {
      type: type.toUpperCase(),
      text: type === 'header' ? 'Header Text' : type === 'body' ? 'Your message content here...' : 'Footer text',
      format: type === 'header' ? 'TEXT' : undefined
    };

    setTemplate(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  const removeComponent = (index) => {
    const newComponents = template.components.filter((_, i) => i !== index);
    setTemplate(prev => ({
      ...prev,
      components: newComponents
    }));
    extractVariables(newComponents);
  };

  const insertVariable = (componentIndex, variableKey) => {
    const newComponents = [...template.components];
    const component = newComponents[componentIndex];
    const cursorPos = component.text.length;
    
    newComponents[componentIndex] = {
      ...component,
      text: component.text.slice(0, cursorPos) + `{{${variableKey}}}` + component.text.slice(cursorPos)
    };
    
    setTemplate(prev => ({
      ...prev,
      components: newComponents
    }));
    
    extractVariables(newComponents);
  };

  const validateTemplate = () => {
    const newErrors = {};
    
    if (!template.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (template.components.length === 0) {
      newErrors.components = 'At least one component is required';
    }
    
    const hasBody = template.components.some(c => c.type === 'BODY');
    if (!hasBody) {
      newErrors.body = 'Template must have a body component';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateTemplate()) return;
    
    onSave({
      ...template,
      variables: variables,
      id: editTemplate?.id || Date.now()
    });
    onClose();
  };

  const handleReset = () => {
    setTemplate({
      name: '',
      category: 'MARKETING',
      language: 'en',
      components: []
    });
    setVariables([]);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {editTemplate ? 'Edit Template' : 'Template Builder'}
              </h2>
              <p className="text-sm text-text-secondary">Create and customize WhatsApp message templates</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-180px)]">
          {/* Builder Panel */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-border">
            <div className="space-y-6">
              {/* Template Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Template Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Template Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => handleTemplateChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                      errors.name ? 'border-error' : 'border-border'
                    }`}
                    placeholder="Enter template name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                    <select
                      value={template.category}
                      onChange={(e) => handleTemplateChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="MARKETING">Marketing</option>
                      <option value="UTILITY">Utility</option>
                      <option value="AUTHENTICATION">Authentication</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Language</label>
                    <select
                      value={template.language}
                      onChange={(e) => handleTemplateChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Components */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">Template Components</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addComponent('header')}
                      iconName="Plus"
                    >
                      Header
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addComponent('body')}
                      iconName="Plus"
                    >
                      Body
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addComponent('footer')}
                      iconName="Plus"
                    >
                      Footer
                    </Button>
                  </div>
                </div>

                {errors.components && (
                  <p className="text-sm text-error">{errors.components}</p>
                )}
                {errors.body && (
                  <p className="text-sm text-error">{errors.body}</p>
                )}

                <div className="space-y-4">
                  {template.components.map((component, index) => (
                    <div key={index} className="border border-border rounded-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={
                              component.type === 'HEADER' ? 'Header' : 
                              component.type === 'BODY' ? 'FileText' : 'Footnote'
                            } 
                            size={16} 
                            className="text-text-secondary" 
                          />
                          <span className="text-sm font-medium text-text-primary">
                            {component.type}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeComponent(index)}
                          iconName="Trash2"
                          className="text-error hover:text-error-dark"
                        />
                      </div>

                      <textarea
                        value={component.text}
                        onChange={(e) => handleComponentChange(index, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
                        rows={component.type === 'BODY' ? 4 : 2}
                        placeholder={`Enter ${component.type.toLowerCase()} text...`}
                      />

                      {/* Variable insertion */}
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-text-secondary mb-2">
                          Insert Variable:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableVariables.map((variable) => (
                            <button
                              key={variable.key}
                              onClick={() => insertVariable(index, variable.key)}
                              className="px-2 py-1 text-xs bg-primary-50 text-primary border border-primary-200 rounded hover:bg-primary-100 transition-colors duration-200"
                            >
                              {variable.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {template.components.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-text-muted" />
                    <p>No components added yet. Click the buttons above to add components.</p>
                  </div>
                )}
              </div>

              {/* Variables Summary */}
              {variables.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-text-primary">Template Variables</h3>
                  <div className="bg-background-secondary rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {variables.map((variable, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="Variable" size={16} className="text-primary" />
                          <span className="text-sm text-text-primary">{{variable}}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-80 p-6 bg-background-secondary">
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
                    {preview || 'Add components to see preview...'}
                  </pre>
                </div>
              </div>

              <div className="text-xs text-text-secondary">
                <Icon name="Info" size={14} className="inline mr-1" />
                Variables are replaced with example values in the preview
              </div>
            </div>
          </div>
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
              disabled={Object.keys(errors).length > 0}
            >
              {editTemplate ? 'Update Template' : 'Save Template'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;