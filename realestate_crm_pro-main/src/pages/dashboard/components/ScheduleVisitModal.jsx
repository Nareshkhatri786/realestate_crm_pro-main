import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScheduleVisitModal = ({ isOpen, onClose, onVisitScheduled }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    project: '',
    unit: '',
    date: '',
    time: '',
    assignedTo: '',
    priority: 'medium',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const projects = [
    'Skyline Residences',
    'Marina Heights',
    'Garden View Apartments',
    'Downtown Plaza',
    'Sunset Villas'
  ];

  const salesExecutives = [
    'John Doe',
    'Sarah Smith',
    'Mike Johnson',
    'Emily Davis',
    'David Wilson'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
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
    
    if (!formData.project) {
      newErrors.project = 'Project is required';
    }

    if (!formData.date) {
      newErrors.date = 'Visit date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Visit date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Visit time is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Sales executive assignment is required';
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
      
      const newVisit = {
        id: Date.now(),
        ...formData,
        status: 'scheduled',
        createdAt: new Date()
      };
      
      // Notify parent component
      onVisitScheduled?.(newVisit);
      
      // Reset form
      setFormData({
        clientName: '',
        phone: '',
        email: '',
        project: '',
        unit: '',
        date: '',
        time: '',
        assignedTo: '',
        priority: 'medium',
        notes: ''
      });
      
      // Close modal
      onClose();
      
      // Show success message (in real app, this would be a toast notification)
      alert('Site visit scheduled successfully!');
      
    } catch (error) {
      console.error('Error scheduling visit:', error);
      alert('Failed to schedule visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAllVisits = () => {
    onClose();
    navigate('/site-visits-scheduler');
  };

  // Generate available dates (next 30 days excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Schedule Site Visit</h2>
              <p className="text-sm text-text-secondary">Schedule a new site visit for your client</p>
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
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project <span className="text-error">*</span>
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
              <Input
                label="Unit/Floor"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="e.g., 2BHK - A-1205"
              />
            </div>
          </div>

          {/* Visit Schedule */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Visit Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Visit Date <span className="text-error">*</span>
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.date ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select date</option>
                  {getAvailableDates().map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = dateObj.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                    return (
                      <option key={date} value={date}>
                        {formattedDate} ({dayName})
                      </option>
                    );
                  })}
                </select>
                {errors.date && <p className="mt-1 text-sm text-error">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Visit Time <span className="text-error">*</span>
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 ${
                    errors.time ? 'border-error' : 'border-border'
                  }`}
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {errors.time && <p className="mt-1 text-sm text-error">{errors.time}</p>}
              </div>
            </div>
          </div>

          {/* Assignment & Priority */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Assignment & Priority</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
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
              placeholder="Any special instructions or client preferences..."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleViewAllVisits}
              iconName="Calendar"
              iconPosition="left"
            >
              View All Visits
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
                iconName={isSubmitting ? "Loader2" : "Calendar"}
                iconPosition="left"
              >
                {isSubmitting ? 'Scheduling Visit...' : 'Schedule Visit'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;