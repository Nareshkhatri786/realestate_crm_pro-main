import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from './Button';
import Icon from '../AppIcon';

const FieldManager = ({ entityType = 'lead', onFieldsChange }) => {
  const [fields, setFields] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldTemplates, setFieldTemplates] = useState([]);

  // Field type definitions
  const fieldTypes = [
    { value: 'text', label: 'Text', icon: 'Type' },
    { value: 'number', label: 'Number', icon: 'Hash' },
    { value: 'email', label: 'Email', icon: 'Mail' },
    { value: 'phone', label: 'Phone', icon: 'Phone' },
    { value: 'date', label: 'Date', icon: 'Calendar' },
    { value: 'dropdown', label: 'Dropdown', icon: 'ChevronDown' },
    { value: 'checkbox', label: 'Checkbox', icon: 'CheckSquare' },
    { value: 'file', label: 'File Upload', icon: 'Upload' },
    { value: 'textarea', label: 'Text Area', icon: 'FileText' },
    { value: 'url', label: 'URL', icon: 'Link' }
  ];

  // Property type templates
  const propertyTypeTemplates = [
    {
      id: 'residential',
      name: 'Residential Properties',
      fields: [
        { name: 'property_size', label: 'Property Size (sqft)', type: 'number', required: true },
        { name: 'bedrooms', label: 'Bedrooms', type: 'dropdown', options: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'] },
        { name: 'bathrooms', label: 'Bathrooms', type: 'number' },
        { name: 'balcony', label: 'Balcony', type: 'checkbox' },
        { name: 'parking', label: 'Parking', type: 'checkbox' },
        { name: 'floor_number', label: 'Floor Number', type: 'number' },
        { name: 'total_floors', label: 'Total Floors', type: 'number' },
        { name: 'facing', label: 'Facing Direction', type: 'dropdown', options: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] }
      ]
    },
    {
      id: 'commercial',
      name: 'Commercial Properties',
      fields: [
        { name: 'built_up_area', label: 'Built-up Area (sqft)', type: 'number', required: true },
        { name: 'carpet_area', label: 'Carpet Area (sqft)', type: 'number' },
        { name: 'property_type', label: 'Property Type', type: 'dropdown', options: ['Office Space', 'Retail Space', 'Warehouse', 'Industrial', 'Co-working Space'] },
        { name: 'furnished_status', label: 'Furnished Status', type: 'dropdown', options: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'] },
        { name: 'parking_spaces', label: 'Parking Spaces', type: 'number' },
        { name: 'cafeteria', label: 'Cafeteria', type: 'checkbox' },
        { name: 'conference_room', label: 'Conference Room', type: 'checkbox' },
        { name: 'security', label: '24/7 Security', type: 'checkbox' }
      ]
    }
  ];

  useEffect(() => {
    loadFields();
    setFieldTemplates(propertyTypeTemplates);
  }, [entityType]);

  const loadFields = () => {
    // Load existing fields from localStorage (in production, this would be an API call)
    const savedFields = localStorage.getItem(`custom_fields_${entityType}`);
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      // Set default fields
      setFields([
        { id: '1', name: 'budget_range', label: 'Budget Range', type: 'dropdown', required: true, options: ['Under 50L', '50L-1Cr', '1-2Cr', '2-5Cr', '5Cr+'], order: 1 },
        { id: '2', name: 'preferred_location', label: 'Preferred Location', type: 'text', required: true, order: 2 },
        { id: '3', name: 'timeline', label: 'Purchase Timeline', type: 'dropdown', options: ['Immediate', '1-3 months', '3-6 months', '6-12 months', 'No rush'], order: 3 }
      ]);
    }
  };

  const saveFields = (newFields) => {
    setFields(newFields);
    localStorage.setItem(`custom_fields_${entityType}`, JSON.stringify(newFields));
    if (onFieldsChange) {
      onFieldsChange(newFields);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newFields = Array.from(fields);
    const [reorderedField] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, reorderedField);

    // Update order property
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index + 1
    }));

    saveFields(updatedFields);
  };

  const addField = (fieldData) => {
    const newField = {
      id: `field_${Date.now()}`,
      ...fieldData,
      order: fields.length + 1
    };
    saveFields([...fields, newField]);
    setShowAddField(false);
  };

  const updateField = (fieldId, fieldData) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...fieldData } : field
    );
    saveFields(updatedFields);
    setEditingField(null);
  };

  const deleteField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    saveFields(updatedFields);
  };

  const applyTemplate = (template) => {
    const templateFields = template.fields.map((field, index) => ({
      id: `template_${Date.now()}_${index}`,
      ...field,
      order: fields.length + index + 1
    }));
    saveFields([...fields, ...templateFields]);
  };

  const duplicateField = (field) => {
    const duplicatedField = {
      ...field,
      id: `field_${Date.now()}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
      order: fields.length + 1
    };
    saveFields([...fields, duplicatedField]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Custom Fields for {entityType.charAt(0).toUpperCase() + entityType.slice(1)}s
          </h3>
          <p className="text-text-secondary">
            Manage custom fields to capture specific information for your {entityType}s
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => setShowAddField(true)}
          >
            Field Templates
          </Button>
          <Button
            variant="primary"
            iconName="Plus"
            onClick={() => setShowAddField(true)}
          >
            Add Field
          </Button>
        </div>
      </div>

      {/* Field Templates */}
      {fieldTemplates.length > 0 && (
        <div className="bg-surface border border-border rounded-radius-md p-6">
          <h4 className="text-lg font-medium text-text-primary mb-4">Quick Templates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fieldTemplates.map(template => (
              <div key={template.id} className="border border-border rounded-radius-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-text-primary">{template.name}</h5>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    onClick={() => applyTemplate(template)}
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  {template.fields.length} fields including {template.fields.slice(0, 3).map(f => f.label).join(', ')}
                  {template.fields.length > 3 && ` and ${template.fields.length - 3} more`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Fields */}
      <div className="bg-surface border border-border rounded-radius-md">
        <div className="border-b border-border p-6">
          <h4 className="text-lg font-medium text-text-primary">Current Fields ({fields.length})</h4>
        </div>
        
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Database" size={48} className="text-text-secondary mx-auto mb-4" />
            <h5 className="text-lg font-medium text-text-primary mb-2">No Custom Fields</h5>
            <p className="text-text-secondary mb-4">
              Add custom fields to capture specific information for your {entityType}s
            </p>
            <Button
              variant="primary"
              iconName="Plus"
              onClick={() => setShowAddField(true)}
            >
              Add First Field
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="p-6">
                  {fields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-background border border-border rounded-radius-sm p-4 mb-3 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps} className="cursor-move">
                                  <Icon name="GripVertical" size={16} className="text-text-secondary" />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Icon 
                                    name={fieldTypes.find(ft => ft.value === field.type)?.icon || 'Circle'} 
                                    size={16} 
                                    className="text-primary" 
                                  />
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-text-primary">{field.label}</span>
                                      {field.required && (
                                        <span className="text-xs bg-error text-white px-2 py-1 rounded">Required</span>
                                      )}
                                    </div>
                                    <div className="text-sm text-text-secondary">
                                      {field.name} • {fieldTypes.find(ft => ft.value === field.type)?.label}
                                      {field.options && ` • ${field.options.length} options`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  iconName="Copy"
                                  onClick={() => duplicateField(field)}
                                  title="Duplicate field"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  iconName="Edit"
                                  onClick={() => setEditingField(field)}
                                  title="Edit field"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  iconName="Trash2"
                                  onClick={() => deleteField(field.id)}
                                  title="Delete field"
                                  className="text-error hover:text-error"
                                />
                              </div>
                            </div>
                            
                            {/* Field Options Preview */}
                            {field.options && field.options.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="text-sm text-text-secondary mb-2">Options:</div>
                                <div className="flex flex-wrap gap-2">
                                  {field.options.slice(0, 5).map((option, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-background border border-border px-2 py-1 rounded"
                                    >
                                      {option}
                                    </span>
                                  ))}
                                  {field.options.length > 5 && (
                                    <span className="text-xs text-text-secondary">
                                      +{field.options.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Add/Edit Field Modal */}
      {(showAddField || editingField) && (
        <FieldEditor
          field={editingField}
          fieldTypes={fieldTypes}
          onSave={editingField ? 
            (fieldData) => updateField(editingField.id, fieldData) : 
            addField
          }
          onCancel={() => {
            setShowAddField(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
};

// Field Editor Component
const FieldEditor = ({ field, fieldTypes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    label: field?.label || '',
    type: field?.type || 'text',
    required: field?.required || false,
    placeholder: field?.placeholder || '',
    options: field?.options || [],
    validation: field?.validation || {},
    conditionalLogic: field?.conditionalLogic || null
  });

  const [newOption, setNewOption] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Field name must be valid (letters, numbers, underscore only)';
    }
    
    if (!formData.label.trim()) {
      newErrors.label = 'Field label is required';
    }
    
    if (['dropdown', 'checkbox'].includes(formData.type) && formData.options.length === 0) {
      newErrors.options = 'At least one option is required for this field type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-radius-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-text-primary">
            {field ? 'Edit Field' : 'Add New Field'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Field Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-error' : 'border-border'
                }`}
                placeholder="e.g., property_size"
              />
              {errors.name && <p className="text-sm text-error mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Display Label *
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className={`w-full px-3 py-2 border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.label ? 'border-error' : 'border-border'
                }`}
                placeholder="e.g., Property Size"
              />
              {errors.label && <p className="text-sm text-error mt-1">{errors.label}</p>}
            </div>
          </div>

          {/* Field Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Field Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, options: [] })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Placeholder Text
            </label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter placeholder text..."
            />
          </div>

          {/* Options for dropdown and checkbox */}
          {['dropdown', 'checkbox'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Options *
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    className="flex-1 px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add option..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    iconName="Plus"
                    onClick={addOption}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.options.length > 0 && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-background border border-border rounded-radius-sm px-3 py-2">
                        <span className="text-text-primary">{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          iconName="X"
                          onClick={() => removeOption(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.options && <p className="text-sm text-error">{errors.options}</p>}
              </div>
            </div>
          )}

          {/* Required Field */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="required" className="text-sm font-medium text-text-primary">
              Required field
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {field ? 'Update Field' : 'Add Field'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldManager;