import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateOpportunityModal = ({ isOpen, onClose, onOpportunityCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    location: '',
    propertyType: '',
    budget: '',
    stage: 'Scheduled',
    priority: 'Medium',
    assignedTo: '',
    nextAction: '',
    nextActionDate: '',
    source: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const propertyTypes = [
    '1 BHK',
    '2 BHK',
    '3 BHK',
    '4 BHK',
    'Villa',
    'Plot'
  ];

  const stages = [
    'Scheduled',
    'Visit Done',
    'Negotiation',
    'Booking'
  ];

  const priorities = [
    'High',
    'Medium',
    'Low'
  ];

  const salesExecutives = [
    'John Doe',
    'Sarah Smith',
    'Mike Johnson',
    'Emily Davis',
    'David Wilson'
  ];

  const sources = [
    'Housing.com',
    'Website',
    'Referral',
    'Walk-in',
    'Social Media',
    'MagicBricks',
    'Direct Inquiry'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(formData.budget.replace(/[^\d]/g, ''))) {
      newErrors.budget = 'Please enter a valid budget amount';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Sales executive assignment is required';
    }

    if (!formData.nextAction.trim()) {
      newErrors.nextAction = 'Next action is required';
    }

    if (!formData.nextActionDate) {
      newErrors.nextActionDate = 'Next action date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOpportunity = {
        id: Date.now(),
        ...formData,
        budget: parseInt(formData.budget.replace(/[^\d]/g, '')),
        stageDate: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        nurtureActive: true
      };
      
      // Notify parent component
      onOpportunityCreated?.(newOpportunity);
      
      // Reset form
      setFormData({
        clientName: '',
        phone: '',
        email: '',
        location: '',
        propertyType: '',
        budget: '',
        stage: 'Scheduled',
        priority: 'Medium',
        assignedTo: '',
        nextAction: '',
        nextActionDate: '',
        source: '',
        notes: ''
      });
      
      // Close modal
      onClose();
      
      // Show success message (in real app, this would be a toast notification)
      alert('Opportunity created successfully!');
      
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAllOpportunities = () => {
    onClose();
    navigate('/opportunities-management');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Create Opportunity</h2>
              <p className="text-sm text-text-secondary">Add a new opportunity to your pipeline</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Client Name"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                error={errors.clientName}
                required
                placeholder="Enter client name"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
                placeholder="+91 98765 43210"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="email@example.com"
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                error={errors.location}
                required
                placeholder="e.g., Whitefield, Bangalore"
              />
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Property Type <span className="text-error">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.propertyType ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-error">{errors.propertyType}</p>}
              </div>
              <Input
                label="Budget (₹)"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                error={errors.budget}
                required
                placeholder="8500000"
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">Select source</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Opportunity Management */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Opportunity Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Assigned To <span className="text-error">*</span>
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.assignedTo ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select sales executive</option>
                  {salesExecutives.map((executive) => (
                    <option key={executive} value={executive}>{executive}</option>
                  ))}
                </select>
                {errors.assignedTo && <p className="mt-1 text-sm text-error">{errors.assignedTo}</p>}
              </div>
            </div>
          </div>

          {/* Next Action */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Next Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Next Action"
                name="nextAction"
                value={formData.nextAction}
                onChange={handleInputChange}
                error={errors.nextAction}
                required
                placeholder="e.g., Schedule site visit"
              />
              <Input
                label="Next Action Date"
                name="nextActionDate"
                type="datetime-local"
                value={formData.nextActionDate}
                onChange={handleInputChange}
                error={errors.nextActionDate}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              placeholder="Any additional notes about the opportunity..."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleViewAllOpportunities}
              iconName="Target"
              iconPosition="left"
            >
              View All Opportunities
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                iconName={isSubmitting ? "Loader2" : "Target"}
                iconPosition="left"
              >
                {isSubmitting ? 'Creating Opportunity...' : 'Create Opportunity'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunityModal;