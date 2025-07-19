import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { fieldsApi } from '../../api';

const FieldBuilder = ({ field, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldData, setFieldData] = useState(field);
  const [errors, setErrors] = useState([]);

  const fieldTypes = fieldsApi.getSupportedFieldTypes();

  const handleSave = () => {
    const validation = fieldsApi.validateField(fieldData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onUpdate(fieldData);
    setIsEditing(false);
    setErrors([]);
  };

  const handleCancel = () => {
    setFieldData(field);
    setIsEditing(false);
    setErrors([]);
  };

  const updateField = (key, value) => {
    setFieldData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectedType = fieldTypes.find(t => t.type === fieldData.type);

  return (
    <div className="border border-border rounded-md p-4 space-y-4">
      {/* Field Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name={selectedType?.icon || 'Circle'} size={16} className="text-primary" />
          <div>
            <h4 className="font-medium text-text-primary">{fieldData.label}</h4>
            <p className="text-sm text-text-secondary">{fieldData.name} • {selectedType?.label}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                iconName="Trash2"
                className="text-error hover:text-error-dark"
              />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Field Configuration */}
      {isEditing && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Field Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={fieldData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="field_name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Display Label <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={fieldData.label}
                onChange={(e) => updateField('label', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Field Label"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Field Type <span className="text-error">*</span>
            </label>
            <select
              value={fieldData.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Select field type...</option>
              {fieldTypes.map(type => (
                <option key={type.type} value={type.type}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          {/* Type-specific Configuration */}
          {fieldData.type === 'dropdown' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Options <span className="text-error">*</span>
              </label>
              <div className="space-y-2">
                {(fieldData.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(fieldData.options || [])];
                        newOptions[index] = e.target.value;
                        updateField('options', newOptions);
                      }}
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = (fieldData.options || []).filter((_, i) => i !== index);
                        updateField('options', newOptions);
                      }}
                      iconName="X"
                      className="text-error"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [...(fieldData.options || []), ''];
                    updateField('options', newOptions);
                  }}
                  iconName="Plus"
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}

          {fieldData.type === 'number' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Min Value</label>
                <input
                  type="number"
                  value={fieldData.min || ''}
                  onChange={(e) => updateField('min', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Max Value</label>
                <input
                  type="number"
                  value={fieldData.max || ''}
                  onChange={(e) => updateField('max', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Step</label>
                <input
                  type="number"
                  value={fieldData.step || ''}
                  onChange={(e) => updateField('step', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  step="0.1"
                />
              </div>
            </div>
          )}

          {(fieldData.type === 'text' || fieldData.type === 'textarea') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Placeholder</label>
                <input
                  type="text"
                  value={fieldData.placeholder || ''}
                  onChange={(e) => updateField('placeholder', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  placeholder="Enter placeholder text..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Max Length</label>
                <input
                  type="number"
                  value={fieldData.maxLength || ''}
                  onChange={(e) => updateField('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
          )}

          {fieldData.type === 'file' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Allowed File Types</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['jpg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'].map(type => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(fieldData.allowedTypes || []).includes(type)}
                      onChange={(e) => {
                        const currentTypes = fieldData.allowedTypes || [];
                        const newTypes = e.target.checked
                          ? [...currentTypes, type]
                          : currentTypes.filter(t => t !== type);
                        updateField('allowedTypes', newTypes);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-text-primary">{type.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Common Options */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={fieldData.required || false}
                onChange={(e) => updateField('required', e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm text-text-primary">Required</span>
            </label>

            {fieldData.type === 'dropdown' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={fieldData.multiple || false}
                  onChange={(e) => updateField('multiple', e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm text-text-primary">Multiple Selection</span>
              </label>
            )}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-error-50 border border-error-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <span className="text-sm font-medium text-error-700">Validation Errors</span>
              </div>
              <ul className="text-sm text-error-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DynamicFieldManager = ({ entityType, isOpen, onClose }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewField, setShowNewField] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const fieldTypes = fieldsApi.getSupportedFieldTypes();

  useEffect(() => {
    if (isOpen) {
      loadFields();
      loadTemplates();
    }
  }, [isOpen, entityType]);

  const loadFields = async () => {
    setLoading(true);
    try {
      // For now, load from localStorage as mock data
      const savedFields = localStorage.getItem(`fields_${entityType}`);
      if (savedFields) {
        setFields(JSON.parse(savedFields));
      } else {
        setFields([]);
      }
    } catch (error) {
      console.error('Failed to load fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fieldsApi.getFieldTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const saveFields = (updatedFields) => {
    localStorage.setItem(`fields_${entityType}`, JSON.stringify(updatedFields));
    setFields(updatedFields);
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      label: '',
      type: 'text',
      required: false,
      position: fields.length
    };
    setFields([...fields, newField]);
    setShowNewField(true);
  };

  const handleUpdateField = (fieldData) => {
    const updatedFields = fields.map(f => 
      f.id === fieldData.id ? fieldData : f
    );
    saveFields(updatedFields);
  };

  const handleDeleteField = (fieldId) => {
    const updatedFields = fields.filter(f => f.id !== fieldId);
    saveFields(updatedFields);
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return;

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const newFields = template.fields.map((field, index) => ({
      ...field,
      id: Date.now() + index,
      position: fields.length + index
    }));

    saveFields([...fields, ...newFields]);
    setSelectedTemplate('');
  };

  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    
    // Update positions
    updatedFields.forEach((field, index) => {
      field.position = index;
    });
    
    saveFields(updatedFields);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Dynamic Field Manager</h2>
              <p className="text-sm text-text-secondary">
                Manage custom fields for {entityType}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Templates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Field Templates</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select a template...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  onClick={handleApplyTemplate}
                  disabled={!selectedTemplate}
                  iconName="Plus"
                >
                  Apply Template
                </Button>
              </div>
            </div>

            {/* Current Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary">Current Fields</h3>
                <Button
                  variant="primary"
                  onClick={handleAddField}
                  iconName="Plus"
                >
                  Add Field
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading fields...</p>
                </div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Settings" size={48} className="mx-auto mb-4 text-text-muted" />
                  <p>No custom fields configured yet</p>
                  <p className="text-sm mt-2">Add fields or apply a template to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields
                    .sort((a, b) => a.position - b.position)
                    .map((field, index) => (
                      <div key={field.id} className="relative">
                        {/* Drag handle */}
                        <div className="absolute left-0 top-0 bottom-0 flex items-center">
                          <button
                            className="p-2 text-text-muted hover:text-text-primary cursor-move"
                            onMouseDown={(e) => {
                              // Simple drag functionality could be implemented here
                              // For now, we'll use buttons for reordering
                            }}
                          >
                            <Icon name="GripVertical" size={16} />
                          </button>
                        </div>
                        
                        <div className="ml-8">
                          <FieldBuilder
                            field={field}
                            onUpdate={handleUpdateField}
                            onDelete={() => handleDeleteField(field.id)}
                          />
                        </div>

                        {/* Move buttons */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveField(index, index - 1)}
                              iconName="ChevronUp"
                            />
                          )}
                          {index < fields.length - 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveField(index, index + 1)}
                              iconName="ChevronDown"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-text-secondary">
            {fields.length} field{fields.length !== 1 ? 's' : ''} configured
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFieldManager;