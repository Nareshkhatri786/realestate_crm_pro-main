import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const CallTracker = ({ contactId, contactPhone, contactName, onCallLogged }) => {
  const [callLogs, setCallLogs] = useState([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);

  // Call status options
  const callStatuses = [
    { value: 'answered', label: 'Answered', icon: 'Phone', color: 'text-success' },
    { value: 'not_answered', label: 'Not Answered', icon: 'PhoneOff', color: 'text-warning' },
    { value: 'switched_off', label: 'Switched Off', icon: 'PhoneOff', color: 'text-error' },
    { value: 'busy', label: 'Busy', icon: 'PhoneMissed', color: 'text-error' },
    { value: 'invalid', label: 'Invalid Number', icon: 'PhoneOff', color: 'text-error' }
  ];

  // Follow-up options based on call status
  const followUpOptions = {
    answered: [
      { value: 'interested', label: 'Interested - Schedule Meeting' },
      { value: 'callback', label: 'Requested Callback' },
      { value: 'not_interested', label: 'Not Interested' },
      { value: 'future', label: 'Interested in Future' }
    ],
    not_answered: [
      { value: 'retry_later', label: 'Retry Later Today' },
      { value: 'retry_tomorrow', label: 'Retry Tomorrow' },
      { value: 'whatsapp', label: 'Send WhatsApp Message' }
    ],
    switched_off: [
      { value: 'retry_evening', label: 'Retry in Evening' },
      { value: 'retry_tomorrow', label: 'Retry Tomorrow' },
      { value: 'whatsapp', label: 'Send WhatsApp Message' }
    ],
    busy: [
      { value: 'retry_30min', label: 'Retry in 30 Minutes' },
      { value: 'retry_later', label: 'Retry Later Today' },
      { value: 'whatsapp', label: 'Send WhatsApp Message' }
    ],
    invalid: [
      { value: 'verify_number', label: 'Verify Phone Number' },
      { value: 'alternative_contact', label: 'Find Alternative Contact' }
    ]
  };

  useEffect(() => {
    loadCallLogs();
  }, [contactId]);

  const loadCallLogs = () => {
    // Load call logs from localStorage (in production, this would be an API call)
    const savedLogs = localStorage.getItem(`call_logs_${contactId}`);
    if (savedLogs) {
      setCallLogs(JSON.parse(savedLogs));
    }
  };

  const saveCallLog = (logData) => {
    const newLog = {
      id: `call_${Date.now()}`,
      contactId,
      contactPhone,
      contactName,
      ...logData,
      timestamp: new Date(),
      createdBy: localStorage.getItem('currentUser') || 'System'
    };

    const updatedLogs = [newLog, ...callLogs];
    setCallLogs(updatedLogs);
    localStorage.setItem(`call_logs_${contactId}`, JSON.stringify(updatedLogs));

    // Also save to global call logs
    const globalLogs = JSON.parse(localStorage.getItem('all_call_logs') || '[]');
    globalLogs.unshift(newLog);
    localStorage.setItem('all_call_logs', JSON.stringify(globalLogs.slice(0, 1000))); // Keep last 1000 logs

    if (onCallLogged) {
      onCallLogged(newLog);
    }
  };

  const initiateCall = () => {
    if (!contactPhone) {
      alert('No phone number available for this contact');
      return;
    }

    // Clean phone number
    const cleanPhone = contactPhone.replace(/[^\d+]/g, '');
    
    // Use device's default dialer
    const telLink = `tel:${cleanPhone}`;
    
    // Try to open the dialer
    try {
      window.open(telLink, '_self');
      
      // Start tracking the call
      setActiveCall({
        phone: cleanPhone,
        startTime: new Date()
      });
      setCallStartTime(new Date());
      setShowCallModal(true);
    } catch (error) {
      console.error('Error opening dialer:', error);
      alert('Unable to open dialer. Please dial manually: ' + cleanPhone);
    }
  };

  const logCall = (callData) => {
    const duration = callStartTime ? 
      Math.round((new Date() - callStartTime) / 1000) : 0;

    saveCallLog({
      ...callData,
      duration: duration,
      phone: activeCall?.phone || contactPhone
    });

    setShowCallModal(false);
    setActiveCall(null);
    setCallStartTime(null);
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const getStatusConfig = (status) => {
    return callStatuses.find(s => s.value === status) || callStatuses[0];
  };

  const scheduleFollowUp = (followUpType, callLog) => {
    let followUpDate = new Date();
    let message = '';

    switch (followUpType) {
      case 'retry_30min':
        followUpDate.setMinutes(followUpDate.getMinutes() + 30);
        message = 'Retry call in 30 minutes';
        break;
      case 'retry_later':
        followUpDate.setHours(followUpDate.getHours() + 4);
        message = 'Retry call later today';
        break;
      case 'retry_tomorrow':
        followUpDate.setDate(followUpDate.getDate() + 1);
        followUpDate.setHours(10, 0, 0, 0);
        message = 'Retry call tomorrow';
        break;
      case 'retry_evening':
        followUpDate.setHours(18, 0, 0, 0);
        message = 'Retry call in evening';
        break;
      case 'whatsapp':
        message = 'Send WhatsApp follow-up message';
        break;
      case 'interested':
        followUpDate.setDate(followUpDate.getDate() + 1);
        message = 'Schedule meeting with interested client';
        break;
      case 'callback':
        followUpDate.setHours(followUpDate.getHours() + 2);
        message = 'Client requested callback';
        break;
      default:
        message = 'General follow-up required';
    }

    // Save follow-up reminder
    const followUp = {
      id: `followup_${Date.now()}`,
      contactId,
      contactName,
      type: followUpType,
      scheduledDate: followUpDate,
      message,
      callLogId: callLog.id,
      status: 'pending',
      createdAt: new Date()
    };

    const followUps = JSON.parse(localStorage.getItem('follow_ups') || '[]');
    followUps.push(followUp);
    localStorage.setItem('follow_ups', JSON.stringify(followUps));

    return followUp;
  };

  return (
    <div className="space-y-4">
      {/* Call Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            iconName="Phone"
            onClick={initiateCall}
            disabled={!contactPhone}
          >
            Call {contactName || 'Contact'}
          </Button>
          {contactPhone && (
            <span className="text-sm text-text-secondary">
              {contactPhone}
            </span>
          )}
        </div>
        
        {callLogs.length > 0 && (
          <div className="text-sm text-text-secondary">
            {callLogs.length} call{callLogs.length !== 1 ? 's' : ''} logged
          </div>
        )}
      </div>

      {/* Call Logs */}
      {callLogs.length > 0 && (
        <div className="bg-surface border border-border rounded-radius-md">
          <div className="border-b border-border p-4">
            <h4 className="text-lg font-medium text-text-primary">Call History</h4>
          </div>
          
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {callLogs.map(log => {
              const statusConfig = getStatusConfig(log.status);
              return (
                <div key={log.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${statusConfig.color}`}>
                        <Icon name={statusConfig.icon} size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          {log.duration > 0 && (
                            <span className="text-sm text-text-secondary">
                              • {formatDuration(log.duration)}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-text-secondary mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        {log.notes && (
                          <div className="text-sm text-text-primary mt-2 bg-background p-2 rounded-radius-sm">
                            {log.notes}
                          </div>
                        )}
                        {log.followUpAction && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Icon name="Clock" size={14} className="text-primary" />
                            <span className="text-sm text-primary">
                              Follow-up: {followUpOptions[log.status]?.find(f => f.value === log.followUpAction)?.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Phone"
                        onClick={initiateCall}
                        title="Call again"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Call Status Modal */}
      {showCallModal && (
        <CallStatusModal
          contactName={contactName}
          contactPhone={activeCall?.phone}
          callStartTime={callStartTime}
          callStatuses={callStatuses}
          followUpOptions={followUpOptions}
          onSave={logCall}
          onCancel={() => {
            setShowCallModal(false);
            setActiveCall(null);
            setCallStartTime(null);
          }}
          onScheduleFollowUp={scheduleFollowUp}
        />
      )}
    </div>
  );
};

// Call Status Modal Component
const CallStatusModal = ({
  contactName,
  contactPhone,
  callStartTime,
  callStatuses,
  followUpOptions,
  onSave,
  onCancel,
  onScheduleFollowUp
}) => {
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
    followUpAction: '',
    outcome: ''
  });

  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (callStartTime) {
        setCurrentDuration(Math.round((new Date() - callStartTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callStartTime]);

  const handleSave = () => {
    if (!formData.status) {
      alert('Please select call status');
      return;
    }

    const callLog = {
      ...formData,
      duration: currentDuration
    };

    // Schedule follow-up if selected
    if (formData.followUpAction) {
      onScheduleFollowUp(formData.followUpAction, callLog);
    }

    onSave(callLog);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const selectedStatus = callStatuses.find(s => s.value === formData.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-radius-lg max-w-md w-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-text-primary">Call Status</h3>
            <div className="text-right">
              <div className="text-sm text-text-secondary">Duration</div>
              <div className="text-lg font-mono font-medium text-text-primary">
                {formatDuration(currentDuration)}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-text-secondary">
              Calling {contactName}
            </div>
            <div className="text-sm font-medium text-text-primary">
              {contactPhone}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Call Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Call Status *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {callStatuses.map(status => (
                <label
                  key={status.value}
                  className={`flex items-center space-x-3 p-3 border rounded-radius-sm cursor-pointer transition-colors ${
                    formData.status === status.value
                      ? 'border-primary bg-primary-50'
                      : 'border-border hover:bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={formData.status === status.value}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value, followUpAction: '' })}
                    className="sr-only"
                  />
                  <Icon name={status.icon} size={16} className={status.color} />
                  <span className="font-medium text-text-primary">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Follow-up Action */}
          {formData.status && followUpOptions[formData.status] && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Follow-up Action
              </label>
              <select
                value={formData.followUpAction}
                onChange={(e) => setFormData({ ...formData, followUpAction: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No follow-up</option>
                {followUpOptions[formData.status].map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Call Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-radius-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Add notes about the call conversation..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!formData.status}
            >
              Save Call Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallTracker;