import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { interactionsApi } from '../api';

const AddInteractionModal = ({ isOpen, onClose, onSave, contactId }) => {
  const [interactionData, setInteractionData] = useState({
    type: '',
    outcome: '',
    duration: '',
    notes: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  
  const interactionTypes = interactionsApi.getInteractionTypes();
  const selectedType = interactionTypes.find(t => t.type === interactionData.type);

  const handleSave = async () => {
    const data = {
      ...interactionData,
      contactId,
      timestamp: new Date(interactionData.timestamp).toISOString(),
      duration: interactionData.duration ? parseInt(interactionData.duration) : undefined,
      source: 'manual'
    };

    const response = await interactionsApi.logInteraction(data);
    if (response.success) {
      onSave(response.data);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setInteractionData({
      type: '',
      outcome: '',
      duration: '',
      notes: '',
      timestamp: new Date().toISOString().slice(0, 16)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Add Interaction</h3>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Interaction Type <span className="text-error">*</span>
            </label>
            <select
              value={interactionData.type}
              onChange={(e) => setInteractionData(prev => ({ ...prev, type: e.target.value, outcome: '' }))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Select type...</option>
              {interactionTypes.map(type => (
                <option key={type.type} value={type.type}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {selectedType && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Outcome <span className="text-error">*</span>
              </label>
              <select
                value={interactionData.outcome}
                onChange={(e) => setInteractionData(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Select outcome...</option>
                {selectedType.outcomes.map(outcome => (
                  <option key={outcome} value={outcome}>
                    {outcome.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={interactionData.timestamp}
              onChange={(e) => setInteractionData(prev => ({ ...prev, timestamp: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {selectedType?.tracksDuration && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={interactionData.duration}
                onChange={(e) => setInteractionData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                min="0"
                placeholder="Enter duration in minutes"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Notes {selectedType?.requiresNotes && <span className="text-error">*</span>}
            </label>
            <textarea
              value={interactionData.notes}
              onChange={(e) => setInteractionData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
              rows={3}
              placeholder="Add notes about this interaction..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!interactionData.type || !interactionData.outcome}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InteractionItem = ({ interaction, onUpdate, onDelete }) => {
  const interactionTypes = interactionsApi.getInteractionTypes();
  const typeConfig = interactionTypes.find(t => t.type === interaction.type);
  
  if (!typeConfig) return null;

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-background-secondary rounded-md">
      {/* Icon */}
      <div className={`w-10 h-10 bg-${typeConfig.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon name={typeConfig.icon} size={16} className={`text-${typeConfig.color}-600`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-medium text-text-primary">{typeConfig.label}</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${typeConfig.color}-100 text-${typeConfig.color}-700`}>
              {interaction.outcome?.replace('_', ' ').toUpperCase()}
            </span>
            {interaction.duration && (
              <span className="text-xs text-text-secondary">
                {formatDuration(interaction.duration)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate(interaction)}
              iconName="Edit"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(interaction.id)}
              iconName="Trash2"
              className="text-error hover:text-error-dark"
            />
          </div>
        </div>

        <p className="text-xs text-text-secondary mt-1">
          {new Date(interaction.timestamp).toLocaleString()}
          {interaction.source === 'system' && ' • Automated'}
        </p>

        {interaction.notes && (
          <p className="text-sm text-text-primary mt-2">{interaction.notes}</p>
        )}
      </div>
    </div>
  );
};

const EngagementScore = ({ contactId }) => {
  const [engagement, setEngagement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagement();
  }, [contactId]);

  const loadEngagement = async () => {
    setLoading(true);
    try {
      const response = await interactionsApi.calculateEngagementScore(contactId);
      if (response.success) {
        setEngagement(response.data);
      }
    } catch (error) {
      console.error('Failed to load engagement score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary rounded-md p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-border rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-border rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!engagement) return null;

  const getScoreColor = (level) => {
    switch (level) {
      case 'Very High': return 'success';
      case 'High': return 'warning';
      case 'Medium': return 'primary';
      default: return 'secondary';
    }
  };

  const scoreColor = getScoreColor(engagement.level);

  return (
    <div className="bg-background-secondary rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-primary">Engagement Score</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadEngagement}
          iconName="RefreshCw"
        />
      </div>

      <div className="flex items-center space-x-3 mb-3">
        <div className={`text-2xl font-bold text-${scoreColor}`}>
          {engagement.score}
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${scoreColor}-100 text-${scoreColor}-700`}>
          {engagement.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
        <div>Calls: {engagement.breakdown.calls}</div>
        <div>WhatsApp: {engagement.breakdown.whatsapp}</div>
        <div>Emails: {engagement.breakdown.emails}</div>
        <div>Meetings: {engagement.breakdown.meetings}</div>
        <div>Site Visits: {engagement.breakdown.siteVisits}</div>
        <div>Total: {engagement.totalInteractions}</div>
      </div>

      {engagement.lastInteraction && (
        <p className="text-xs text-text-secondary mt-2">
          Last: {new Date(engagement.lastInteraction).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const InteractionTimeline = ({ contactId, contactName, isOpen, onClose }) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30');

  const interactionTypes = interactionsApi.getInteractionTypes();

  useEffect(() => {
    if (isOpen) {
      loadInteractions();
    }
  }, [isOpen, contactId, filter, dateFilter]);

  const loadInteractions = async () => {
    setLoading(true);
    try {
      const filters = { contactId };
      
      if (filter !== 'all') {
        filters.type = filter;
      }
      
      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);
        filters.dateFrom = dateFrom.toISOString();
      }

      const response = await interactionsApi.getInteractions(filters);
      if (response.success) {
        setInteractions(response.data);
      }
    } catch (error) {
      console.error('Failed to load interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInteraction = (newInteraction) => {
    setInteractions([newInteraction, ...interactions]);
  };

  const handleUpdateInteraction = async (interaction) => {
    // In a real app, this would open an edit modal
    console.log('Update interaction:', interaction);
  };

  const handleDeleteInteraction = async (interactionId) => {
    if (confirm('Are you sure you want to delete this interaction?')) {
      try {
        const response = await interactionsApi.deleteInteraction(interactionId);
        if (response.success) {
          setInteractions(interactions.filter(i => i.id !== interactionId));
        }
      } catch (error) {
        console.error('Failed to delete interaction:', error);
      }
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await interactionsApi.exportInteractions(contactId, format);
      if (response.success) {
        alert(`Exported ${response.data.recordCount} interactions to ${response.data.filename}`);
      }
    } catch (error) {
      console.error('Failed to export interactions:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Interaction Timeline</h2>
              <p className="text-sm text-text-secondary">{contactName}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Sidebar */}
          <div className="w-80 p-6 border-r border-border overflow-y-auto">
            <div className="space-y-6">
              {/* Engagement Score */}
              <EngagementScore contactId={contactId} />

              {/* Filters */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-text-primary">Filters</h3>
                
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Interaction Type
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="all">All Types</option>
                    {interactionTypes.map(type => (
                      <option key={type.type} value={type.type}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Time Period
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={() => setIsAddModalOpen(true)}
                  iconName="Plus"
                  className="w-full"
                >
                  Add Interaction
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('json')}
                    iconName="Download"
                    className="flex-1"
                  >
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('csv')}
                    iconName="Download"
                    className="flex-1"
                  >
                    CSV
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary">
                  Timeline ({interactions.length} interactions)
                </h3>
                <Button
                  variant="ghost"
                  onClick={loadInteractions}
                  iconName="RefreshCw"
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading interactions...</p>
                </div>
              ) : interactions.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Activity" size={48} className="mx-auto mb-4 text-text-muted" />
                  <p>No interactions found</p>
                  <p className="text-sm mt-2">Add your first interaction to start tracking engagement</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interactions.map((interaction, index) => (
                    <div key={interaction.id} className="relative">
                      {/* Timeline line */}
                      {index < interactions.length - 1 && (
                        <div className="absolute left-5 top-16 bottom-0 w-px bg-border"></div>
                      )}
                      
                      <InteractionItem
                        interaction={interaction}
                        onUpdate={handleUpdateInteraction}
                        onDelete={handleDeleteInteraction}
                      />
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
            Total engagement points: {interactions.reduce((sum, i) => sum + (i.score || 0), 0)}
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Add Interaction Modal */}
      <AddInteractionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddInteraction}
        contactId={contactId}
      />
    </div>
  );
};

export default InteractionTimeline;