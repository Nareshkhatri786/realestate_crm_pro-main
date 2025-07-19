import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { callsApi } from '../api';

const CallStatusModal = ({ isOpen, onClose, onSave, call }) => {
  const [status, setStatus] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpType, setFollowUpType] = useState('call');

  const statusOptions = callsApi.getCallStatusOptions();

  useEffect(() => {
    if (call) {
      setStatus(call.status || '');
      setDuration(call.duration || '');
      setNotes(call.notes || '');
    }
  }, [call]);

  const handleSave = () => {
    const callData = {
      status,
      duration: status === 'answered' ? parseInt(duration) || 0 : 0,
      notes,
      endTime: new Date().toISOString()
    };

    const followUp = followUpRequired ? {
      type: followUpType,
      scheduledDate: followUpDate,
      notes: `Follow-up for call on ${new Date(call.startTime).toLocaleDateString()}`
    } : null;

    onSave(callData, followUp);
    onClose();
  };

  const handleReset = () => {
    setStatus('');
    setDuration('');
    setNotes('');
    setFollowUpRequired(false);
    setFollowUpDate('');
    setFollowUpType('call');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Call Status</h3>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Call Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Call Status <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`p-3 border rounded-md flex items-center space-x-2 transition-colors duration-200 ${
                    status === option.value
                      ? `border-${option.color} bg-${option.color}-50 text-${option.color}`
                      : 'border-border hover:border-primary-200'
                  }`}
                >
                  <Icon name={option.icon} size={16} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration - only for answered calls */}
          {status === 'answered' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Enter call duration in seconds"
                min="0"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100 resize-none"
              rows={3}
              placeholder="Add call notes..."
            />
          </div>

          {/* Follow-up */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={(e) => setFollowUpRequired(e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm font-medium text-text-primary">Schedule Follow-up</span>
            </label>

            {followUpRequired && (
              <div className="space-y-3 pl-6 border-l-2 border-primary-200">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Follow-up Type
                  </label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            )}
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
              disabled={!status}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CallTracker = ({ contactId, contactName, phoneNumber, isOpen, onClose }) => {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCall, setActiveCall] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [callToUpdate, setCallToUpdate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadCallHistory();
    }
  }, [isOpen, contactId]);

  const loadCallHistory = async () => {
    setLoading(true);
    try {
      const response = await callsApi.getCallHistory({ contactId });
      if (response.success) {
        setCallHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateCall = async () => {
    try {
      const validation = callsApi.validatePhoneNumber(phoneNumber);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const response = await callsApi.initiateCall({
        contactId,
        phoneNumber: validation.formatted,
        contactName,
        startTime: new Date().toISOString()
      });

      if (response.success) {
        setActiveCall(response.data);
        
        // Open device dialer
        const dialerResponse = callsApi.openDialer(phoneNumber);
        if (!dialerResponse.success) {
          console.error('Failed to open dialer:', dialerResponse.error);
        }

        // Auto-prompt for status after a delay
        setTimeout(() => {
          if (activeCall) {
            setCallToUpdate(response.data);
            setIsStatusModalOpen(true);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to initiate call:', error);
    }
  };

  const handleUpdateCallStatus = async (statusData, followUpData) => {
    try {
      const callData = {
        id: callToUpdate.callId,
        contactId,
        contactName,
        phoneNumber,
        startTime: callToUpdate.startTime,
        ...statusData
      };

      const logResponse = await callsApi.logCall(callData);
      if (logResponse.success) {
        // Schedule follow-up if required
        if (followUpData) {
          await callsApi.scheduleFollowUp(logResponse.data.id, followUpData);
        }

        // Refresh call history
        loadCallHistory();
        setActiveCall(null);
        setCallToUpdate(null);
      }
    } catch (error) {
      console.error('Failed to update call status:', error);
    }
  };

  const handleDeleteCall = async (callId) => {
    if (confirm('Are you sure you want to delete this call log?')) {
      try {
        const response = await callsApi.deleteCall(callId);
        if (response.success) {
          loadCallHistory();
        }
      } catch (error) {
        console.error('Failed to delete call:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const statusOption = callsApi.getCallStatusOptions().find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'secondary';
  };

  const getStatusIcon = (status) => {
    const statusOption = callsApi.getCallStatusOptions().find(opt => opt.value === status);
    return statusOption ? statusOption.icon : 'Phone';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-radius-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Phone" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Call Tracker</h2>
              <p className="text-sm text-text-secondary">{contactName} • {phoneNumber}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Call Actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-primary">Call Actions</h3>
              <Button
                variant="primary"
                onClick={handleInitiateCall}
                disabled={!!activeCall}
                iconName="Phone"
              >
                {activeCall ? 'Call in Progress' : 'Make Call'}
              </Button>
            </div>

            {/* Active Call */}
            {activeCall && (
              <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-primary">Call in Progress</p>
                      <p className="text-sm text-primary-700">
                        Started: {new Date(activeCall.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCallToUpdate(activeCall);
                      setIsStatusModalOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}

            {/* Call History */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary">Call History</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading call history...</p>
                </div>
              ) : callHistory.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Phone" size={48} className="mx-auto mb-4 text-text-muted" />
                  <p>No call history found</p>
                  <p className="text-sm mt-2">Make your first call to start tracking</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {callHistory.map((call) => (
                    <div key={call.id} className="bg-background-secondary rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-${getStatusColor(call.status)}-100 rounded-full flex items-center justify-center`}>
                            <Icon 
                              name={getStatusIcon(call.status)} 
                              size={16} 
                              className={`text-${getStatusColor(call.status)}`} 
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(call.status)}-100 text-${getStatusColor(call.status)}`}>
                                {call.status.replace('_', ' ').toUpperCase()}
                              </span>
                              {call.duration > 0 && (
                                <span className="text-sm text-text-secondary">
                                  {callsApi.formatDuration(call.duration)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">
                              {new Date(call.startTime).toLocaleString()}
                            </p>
                            {call.notes && (
                              <p className="text-sm text-text-primary mt-1">{call.notes}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCall(call.id)}
                          iconName="Trash2"
                          className="text-error hover:text-error-dark"
                        />
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
            {callHistory.length} call{callHistory.length !== 1 ? 's' : ''} logged
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Call Status Modal */}
      <CallStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setCallToUpdate(null);
        }}
        onSave={handleUpdateCallStatus}
        call={callToUpdate}
      />
    </div>
  );
};

export default CallTracker;