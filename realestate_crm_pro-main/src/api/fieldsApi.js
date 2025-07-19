import { apiService } from './apiClient';

// Dynamic Field Management API
export const fieldsApi = {
  // Get all custom fields for an entity type
  getFields: async (entityType) => {
    try {
      const response = await apiService.get(`/api/fields/${entityType}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch fields for ${entityType}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create a new field
  createField: async (fieldData) => {
    try {
      const response = await apiService.post('/api/fields', fieldData);
      return response;
    } catch (error) {
      console.error('Failed to create field:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update an existing field
  updateField: async (fieldId, fieldData) => {
    try {
      const response = await apiService.put(`/api/fields/${fieldId}`, fieldData);
      return response;
    } catch (error) {
      console.error('Failed to update field:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete a field
  deleteField: async (fieldId) => {
    try {
      const response = await apiService.delete(`/api/fields/${fieldId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete field:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update field positions (for drag-and-drop)
  updateFieldPositions: async (entityType, fieldPositions) => {
    try {
      const response = await apiService.put(`/api/fields/${entityType}/positions`, { 
        positions: fieldPositions 
      });
      return response;
    } catch (error) {
      console.error('Failed to update field positions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get field templates
  getFieldTemplates: async () => {
    try {
      // For now, return mock templates
      const templates = [
        {
          id: 'residential_property',
          name: 'Residential Property',
          description: 'Standard fields for residential properties',
          fields: [
            { name: 'property_type', label: 'Property Type', type: 'dropdown', options: ['Apartment', 'Villa', 'Townhouse'], required: true },
            { name: 'bedrooms', label: 'Bedrooms', type: 'number', min: 1, max: 10, required: true },
            { name: 'bathrooms', label: 'Bathrooms', type: 'number', min: 1, max: 10, required: true },
            { name: 'area_sqft', label: 'Area (Sq Ft)', type: 'number', min: 100, required: true },
            { name: 'furnished', label: 'Furnished', type: 'dropdown', options: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'] },
            { name: 'parking', label: 'Parking Spaces', type: 'number', min: 0, max: 5 },
            { name: 'balcony', label: 'Has Balcony', type: 'checkbox' },
            { name: 'amenities', label: 'Amenities', type: 'text' }
          ]
        },
        {
          id: 'commercial_property',
          name: 'Commercial Property',
          description: 'Standard fields for commercial properties',
          fields: [
            { name: 'property_type', label: 'Property Type', type: 'dropdown', options: ['Office', 'Retail', 'Warehouse', 'Industrial'], required: true },
            { name: 'area_sqft', label: 'Area (Sq Ft)', type: 'number', min: 100, required: true },
            { name: 'floor_number', label: 'Floor Number', type: 'number' },
            { name: 'total_floors', label: 'Total Floors', type: 'number' },
            { name: 'parking_spaces', label: 'Parking Spaces', type: 'number', min: 0 },
            { name: 'lift_access', label: 'Lift Access', type: 'checkbox' },
            { name: 'power_backup', label: 'Power Backup', type: 'checkbox' },
            { name: 'security', label: 'Security Features', type: 'text' }
          ]
        },
        {
          id: 'lead_qualification',
          name: 'Lead Qualification',
          description: 'Additional fields for lead qualification',
          fields: [
            { name: 'budget_range', label: 'Budget Range', type: 'dropdown', options: ['Below 50L', '50L-1Cr', '1Cr-2Cr', 'Above 2Cr'], required: true },
            { name: 'loan_required', label: 'Loan Required', type: 'checkbox' },
            { name: 'employment_type', label: 'Employment Type', type: 'dropdown', options: ['Salaried', 'Self Employed', 'Business Owner', 'Other'] },
            { name: 'family_size', label: 'Family Size', type: 'number', min: 1, max: 20 },
            { name: 'current_residence', label: 'Current Residence', type: 'dropdown', options: ['Owned', 'Rented', 'Family Property'] },
            { name: 'decision_timeline', label: 'Decision Timeline', type: 'dropdown', options: ['Immediate', '1-3 months', '3-6 months', '6+ months'] },
            { name: 'preferred_locations', label: 'Preferred Locations', type: 'text' },
            { name: 'special_requirements', label: 'Special Requirements', type: 'text' }
          ]
        }
      ];

      return {
        success: true,
        data: templates
      };
    } catch (error) {
      console.error('Failed to fetch field templates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Apply a field template to an entity
  applyTemplate: async (entityType, templateId) => {
    try {
      const response = await apiService.post(`/api/fields/${entityType}/template`, { 
        templateId 
      });
      return response;
    } catch (error) {
      console.error('Failed to apply template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate field configuration
  validateField: (fieldData) => {
    const errors = [];

    if (!fieldData.name || !fieldData.name.trim()) {
      errors.push('Field name is required');
    }

    if (!fieldData.label || !fieldData.label.trim()) {
      errors.push('Field label is required');
    }

    if (!fieldData.type) {
      errors.push('Field type is required');
    }

    // Type-specific validations
    switch (fieldData.type) {
      case 'dropdown':
        if (!fieldData.options || fieldData.options.length === 0) {
          errors.push('Dropdown options are required');
        }
        break;
      case 'number':
        if (fieldData.min !== undefined && fieldData.max !== undefined && fieldData.min > fieldData.max) {
          errors.push('Minimum value cannot be greater than maximum value');
        }
        break;
      case 'text':
        if (fieldData.maxLength !== undefined && fieldData.maxLength < 1) {
          errors.push('Maximum length must be at least 1');
        }
        break;
      case 'email':
        // Email validation will be handled by the input component
        break;
      case 'phone':
        // Phone validation will be handled by the input component
        break;
      case 'date':
        // Date validation will be handled by the input component
        break;
      case 'file':
        if (fieldData.allowedTypes && fieldData.allowedTypes.length === 0) {
          errors.push('At least one file type must be allowed');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Get supported field types
  getSupportedFieldTypes: () => {
    return [
      {
        type: 'text',
        label: 'Text',
        icon: 'Type',
        description: 'Single line text input',
        configurable: ['placeholder', 'maxLength', 'pattern', 'required']
      },
      {
        type: 'number',
        label: 'Number',
        icon: 'Hash',
        description: 'Numeric input with validation',
        configurable: ['min', 'max', 'step', 'required']
      },
      {
        type: 'email',
        label: 'Email',
        icon: 'Mail',
        description: 'Email address with validation',
        configurable: ['placeholder', 'required']
      },
      {
        type: 'phone',
        label: 'Phone',
        icon: 'Phone',
        description: 'Phone number with formatting',
        configurable: ['placeholder', 'required']
      },
      {
        type: 'date',
        label: 'Date',
        icon: 'Calendar',
        description: 'Date picker input',
        configurable: ['min', 'max', 'required']
      },
      {
        type: 'dropdown',
        label: 'Dropdown',
        icon: 'ChevronDown',
        description: 'Select from predefined options',
        configurable: ['options', 'multiple', 'required']
      },
      {
        type: 'checkbox',
        label: 'Checkbox',
        icon: 'CheckSquare',
        description: 'Boolean true/false input',
        configurable: ['defaultValue']
      },
      {
        type: 'file',
        label: 'File Upload',
        icon: 'Upload',
        description: 'File upload with type restrictions',
        configurable: ['allowedTypes', 'maxSize', 'multiple', 'required']
      },
      {
        type: 'textarea',
        label: 'Text Area',
        icon: 'FileText',
        description: 'Multi-line text input',
        configurable: ['placeholder', 'maxLength', 'rows', 'required']
      }
    ];
  }
};

export default fieldsApi;