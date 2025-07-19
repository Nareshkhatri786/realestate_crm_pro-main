import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const QuickScheduleForm = ({ onSchedule, prospects, salesExecutives, projects }) => {
  const [formData, setFormData] = useState({
    prospectId: '',
    prospectName: '',
    phone: '',
    project: '',
    date: '',
    time: '',
    salesExecutive: '',
    notes: ''
  });

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProspectSearch = (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = prospects?.filter(prospect => 
      prospect?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect?.phone?.includes(searchTerm)
    ) || [];
    setSearchResults(results);
  };

  const selectProspect = (prospect) => {
    setFormData(prev => ({
      ...prev,
      prospectId: prospect.id,
      prospectName: prospect.name,
      phone: prospect.phone,
      project: prospect.project
    }));
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.prospectName && formData.date && formData.time && formData.salesExecutive) {
      onSchedule(formData);
      setFormData({
        prospectId: '',
        prospectName: '',
        phone: '',
        project: '',
        date: '',
        time: '',
        salesExecutive: '',
        notes: ''
      });
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">Quick Schedule</h3>
        <p className="text-sm text-text-secondary">Schedule a new site visit</p>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Prospect Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Prospect *
          </label>
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={formData.prospectName}
            onChange={(e) => {
              handleInputChange('prospectName', e.target.value);
              handleProspectSearch(e.target.value);
            }}
            required
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((prospect) => (
                <button
                  key={prospect.id}
                  type="button"
                  onClick={() => selectProspect(prospect)}
                  className="w-full px-3 py-2 text-left hover:bg-background-secondary transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{prospect.name}</p>
                      <p className="text-xs text-text-secondary">{prospect.phone}</p>
                    </div>
                    <span className="text-xs text-text-secondary">{prospect.project}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone (Auto-filled) */}
        {formData.phone && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              readOnly
              className="bg-background-secondary"
            />
          </div>
        )}

        {/* Project Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Project *
          </label>
          <select
            value={formData.project}
            onChange={(e) => handleInputChange('project', e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Project</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            )) || []}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date *
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={getTomorrowDate()}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Time *
            </label>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Sales Executive */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Sales Executive *
          </label>
          <select
            value={formData.salesExecutive}
            onChange={(e) => handleInputChange('salesExecutive', e.target.value)}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Executive</option>
            {salesExecutives?.map((executive) => (
              <option key={executive.id} value={executive.name}>
                {executive.name}
              </option>
            )) || []}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          iconName="Calendar"
          iconPosition="left"
        >
          Schedule Visit
        </Button>
      </form>
    </div>
  );
};

export default QuickScheduleForm;