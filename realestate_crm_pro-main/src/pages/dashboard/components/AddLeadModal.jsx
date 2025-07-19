import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddLeadModal = ({ isOpen, onClose, onLeadAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: '',
    project: '',
    unitType: '',
    budget: '',
    timeline: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const sources = [
    'Housing.com',
    'Website',
    'Referral',
    'Walk-in',
    'Social Media',
    'MagicBricks',
    'Others'
  ];

  const projects = [
    'Skyline Residences',
    'Marina Heights',
    'Garden View Apartments',
    'Downtown Plaza',
    'Sunset Villas'
  ];

  const unitTypes = [
    '1 BHK',
    '2 BHK',
    '3 BHK',
    '4 BHK',
    'Villa'
  ];

  const budgetRanges = [
    '25-35 Lakhs',
    '35-45 Lakhs',
    '45-55 Lakhs',
    '55-65 Lakhs',
    '65-75 Lakhs',
    '75+ Lakhs'
  ];

  const timelines = [
    'Immediate',
    '1-3 months',
    '3-6 months',
    '6-12 months',
    '12+ months'
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
    
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    
    if (!formData.project) {
      newErrors.project = 'Project is required';
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
      
      const newLead = {
        id: Date.now(),
        ...formData,
        status: 'new',
        nurturingStage: 'not-started',
        nurturingProgress: 0,
        createdDate: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0],
        lastContactType: 'Form Submission',
        followUpStatus: 'upcoming',
        assignedTo: null
      };
      
      // Notify parent component
      onLeadAdded?.(newLead);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        source: '',
        project: '',
        unitType: '',
        budget: '',
        timeline: '',
        notes: ''
      });
      
      // Close modal
      onClose();
      
      // Show success message (in real app, this would be a toast notification)
      alert('Lead added successfully!');
      
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAllLeads = () => {
    onClose();
    navigate('/leads-management');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Add New Lead</h2>
              <p className="text-sm text-text-secondary">Add a new lead to your pipeline</p>
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="Enter full name"
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
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Source <span className="text-error">*</span>
                </label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.source ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select source</option>
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                {errors.source && <p className="mt-1 text-sm text-error">{errors.source}</p>}
              </div>
            </div>
          </div>

          {/* Project & Preferences */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Project & Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Interested Project <span className="text-error">*</span>
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.project ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
                {errors.project && <p className="mt-1 text-sm text-error">{errors.project}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Unit Type</label>
                <select
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">Select unit type</option>
                  {unitTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  <option value="">Select timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
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
              placeholder="Any additional notes about the lead..."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleViewAllLeads}
              iconName="Users"
              iconPosition="left"
            >
              View All Leads
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
                iconName={isSubmitting ? "Loader2" : "UserPlus"}
                iconPosition="left"
              >
                {isSubmitting ? 'Adding Lead...' : 'Add Lead'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;