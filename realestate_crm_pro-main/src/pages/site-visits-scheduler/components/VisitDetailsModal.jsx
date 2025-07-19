import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const VisitDetailsModal = ({ visit, isOpen, onClose, onUpdate, onComplete, onReschedule }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [outcomeData, setOutcomeData] = useState({
    attendance: '',
    feedback: '',
    nextAction: '',
    opportunityStage: '',
    notes: ''
  });

  if (!isOpen || !visit) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success bg-success-50 border-success-200';
      case 'pending': return 'text-warning bg-warning-50 border-warning-200';
      case 'completed': return 'text-primary bg-primary-50 border-primary-200';
      case 'no-show': return 'text-error bg-error-50 border-error-200';
      default: return 'text-text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleOutcomeSubmit = () => {
    if (outcomeData.attendance && outcomeData.feedback) {
      onComplete(visit.id, outcomeData);
      onClose();
    }
  };

  const tabs = [
    { id: 'details', label: 'Visit Details', icon: 'Info' },
    { id: 'prospect', label: 'Prospect Info', icon: 'User' },
    { id: 'outcome', label: 'Visit Outcome', icon: 'CheckCircle' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Site Visit Details</h2>
              <p className="text-sm text-text-secondary">Visit ID: #{visit.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Priority</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    visit.priority === 'high' ? 'text-error bg-error-50' : 
                    visit.priority === 'medium'? 'text-warning bg-warning-50' : 'text-success bg-success-50'
                  }`}>
                    {visit.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Date</label>
                  <div className="flex items-center space-x-2 text-text-primary">
                    <Icon name="Calendar" size={16} />
                    <span>{formatDate(visit.date)}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Time</label>
                  <div className="flex items-center space-x-2 text-text-primary">
                    <Icon name="Clock" size={16} />
                    <span>{formatTime(visit.time)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Project</label>
                <div className="flex items-center space-x-2 text-text-primary">
                  <Icon name="Building2" size={16} />
                  <span>{visit.project}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Sales Executive</label>
                <div className="flex items-center space-x-2 text-text-primary">
                  <Icon name="User" size={16} />
                  <span>{visit.salesExecutive}</span>
                </div>
              </div>

              {visit.notes && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Notes</label>
                  <p className="text-text-secondary bg-background-secondary p-3 rounded-md">{visit.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prospect' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary-foreground">
                    {visit.prospectName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{visit.prospectName}</h3>
                  <p className="text-text-secondary">{visit.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <p className="text-text-secondary">{visit.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Lead Source</label>
                  <p className="text-text-secondary">{visit.leadSource || 'Direct'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Requirements</label>
                <p className="text-text-secondary bg-background-secondary p-3 rounded-md">
                  {visit.requirements || 'Looking for a 2-3 BHK apartment with good amenities and connectivity.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Budget Range</label>
                <p className="text-text-primary font-medium">₹{visit.budgetMin || '50,00,000'} - ₹{visit.budgetMax || '75,00,000'}</p>
              </div>
            </div>
          )}

          {activeTab === 'outcome' && (
            <div className="space-y-6">
              {visit.status === 'completed' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                      <span className="font-medium text-success">Visit Completed</span>
                    </div>
                    <p className="text-sm text-success-700">This visit has been marked as completed.</p>
                  </div>
                  
                  {visit.outcome && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Attendance</label>
                        <p className="text-text-secondary">{visit.outcome.attendance}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Feedback</label>
                        <p className="text-text-secondary bg-background-secondary p-3 rounded-md">{visit.outcome.feedback}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Next Action</label>
                        <p className="text-text-secondary">{visit.outcome.nextAction}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Attendance Status *</label>
                    <select
                      value={outcomeData.attendance}
                      onChange={(e) => setOutcomeData(prev => ({ ...prev, attendance: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select attendance status</option>
                      <option value="attended">Attended</option>
                      <option value="rescheduled">Rescheduled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Prospect Feedback *</label>
                    <textarea
                      value={outcomeData.feedback}
                      onChange={(e) => setOutcomeData(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="Enter prospect feedback and interest level..."
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Next Action</label>
                    <select
                      value={outcomeData.nextAction}
                      onChange={(e) => setOutcomeData(prev => ({ ...prev, nextAction: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select next action</option>
                      <option value="follow-up">Schedule Follow-up</option>
                      <option value="negotiation">Move to Negotiation</option>
                      <option value="site-visit">Schedule Another Visit</option>
                      <option value="disqualify">Disqualify Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Additional Notes</label>
                    <textarea
                      value={outcomeData.notes}
                      onChange={(e) => setOutcomeData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes or observations..."
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-3">
            {visit.status !== 'completed' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onReschedule(visit)}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Reschedule
                </Button>
                {activeTab === 'outcome' && (
                  <Button
                    variant="primary"
                    onClick={handleOutcomeSubmit}
                    disabled={!outcomeData.attendance || !outcomeData.feedback}
                    iconName="CheckCircle"
                    iconPosition="left"
                  >
                    Complete Visit
                  </Button>
                )}
              </>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsModal;