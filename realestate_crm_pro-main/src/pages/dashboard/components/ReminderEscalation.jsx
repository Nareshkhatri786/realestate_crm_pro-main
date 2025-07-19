import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReminderEscalation = ({ className = '' }) => {
  const [escalationRules, setEscalationRules] = useState([]);
  const [pendingEscalations, setPendingEscalations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock escalation rules configuration
  const mockEscalationRules = [
    {
      id: 1,
      name: 'High-Value Lead Escalation',
      criteria: {
        leadValue: { min: 5000000 }, // 50 Lakhs+
        untouchedDays: 2,
        priority: 'high'
      },
      supervisors: ['manager@company.com', 'supervisor@company.com'],
      active: true
    },
    {
      id: 2,
      name: 'Qualified Lead Follow-up',
      criteria: {
        leadValue: { min: 2000000 }, // 20 Lakhs+
        untouchedDays: 3,
        status: 'qualified'
      },
      supervisors: ['manager@company.com'],
      active: true
    },
    {
      id: 3,
      name: 'Hot Lead Escalation',
      criteria: {
        untouchedDays: 1,
        priority: 'high',
        engagementScore: { min: 80 }
      },
      supervisors: ['teamlead@company.com', 'manager@company.com'],
      active: true
    }
  ];

  // Mock leads that need escalation
  const mockPendingEscalations = [
    {
      id: 1,
      leadName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      project: 'Skyline Residences',
      assignedTo: 'John Doe',
      assignedToEmail: 'john.doe@company.com',
      leadValue: 8500000,
      priority: 'high',
      status: 'qualified',
      lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      daysSinceLastContact: 3,
      triggerRule: 'High-Value Lead Escalation',
      escalationRequired: true,
      escalatedAt: null
    },
    {
      id: 2,
      leadName: 'Priya Sharma',
      phone: '+91 87654 32109',
      project: 'Marina Heights',
      assignedTo: 'Sarah Smith',
      assignedToEmail: 'sarah.smith@company.com',
      leadValue: 6200000,
      priority: 'high',
      status: 'nurturing',
      lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      daysSinceLastContact: 2,
      triggerRule: 'Hot Lead Escalation',
      escalationRequired: true,
      escalatedAt: null
    },
    {
      id: 3,
      leadName: 'Amit Patel',
      phone: '+91 76543 21098',
      project: 'Garden View',
      assignedTo: 'Mike Johnson',
      assignedToEmail: 'mike.johnson@company.com',
      leadValue: 4500000,
      priority: 'medium',
      status: 'qualified',
      lastContactDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      daysSinceLastContact: 4,
      triggerRule: 'Qualified Lead Follow-up',
      escalationRequired: true,
      escalatedAt: null
    }
  ];

  // Mock recent notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'escalation_sent',
      message: 'Escalation sent for Rajesh Kumar (₹85L lead) - 3 days overdue',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      leadId: 1,
      severity: 'high'
    },
    {
      id: 2,
      type: 'escalation_sent',
      message: 'Escalation sent for Priya Sharma (High engagement) - 2 days overdue',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      leadId: 2,
      severity: 'high'
    },
    {
      id: 3,
      type: 'rule_triggered',
      message: 'New escalation rule triggered for Amit Patel',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      leadId: 3,
      severity: 'medium'
    }
  ];

  useEffect(() => {
    // Initialize data
    setEscalationRules(mockEscalationRules);
    setPendingEscalations(mockPendingEscalations);
    setNotifications(mockNotifications);

    // Check for escalations every 30 seconds
    const interval = setInterval(() => {
      checkAndTriggerEscalations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkAndTriggerEscalations = () => {
    // In real implementation, this would check against actual lead data
    console.log('Checking for escalation triggers...');
  };

  const handleManualEscalation = (escalation) => {
    const escalationData = {
      leadId: escalation.id,
      leadName: escalation.leadName,
      assignedTo: escalation.assignedTo,
      assignedToEmail: escalation.assignedToEmail,
      daysSinceLastContact: escalation.daysSinceLastContact,
      leadValue: escalation.leadValue,
      rule: escalation.triggerRule,
      timestamp: new Date().toISOString()
    };

    // Simulate sending escalation email/notification
    console.log('Sending escalation:', escalationData);
    
    // Update the escalation status
    setPendingEscalations(prev => 
      prev.map(item => 
        item.id === escalation.id 
          ? { ...item, escalatedAt: new Date(), escalationRequired: false }
          : item
      )
    );

    // Add notification
    const newNotification = {
      id: Date.now(),
      type: 'escalation_sent',
      message: `Manual escalation sent for ${escalation.leadName} - ${escalation.daysSinceLastContact} days overdue`,
      timestamp: new Date(),
      leadId: escalation.id,
      severity: escalation.priority === 'high' ? 'high' : 'medium'
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  const handleSnoozeEscalation = (escalationId, hours = 24) => {
    setPendingEscalations(prev => 
      prev.map(item => 
        item.id === escalationId 
          ? { ...item, snoozedUntil: new Date(Date.now() + hours * 60 * 60 * 1000) }
          : item
      )
    );
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(0)}L`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error-600 bg-error-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const activeEscalations = pendingEscalations.filter(e => 
    e.escalationRequired && (!e.snoozedUntil || new Date() > e.snoozedUntil)
  );

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning-600" />
            <h3 className="text-lg font-semibold text-text-primary">Reminder Escalations</h3>
          </div>
          <div className="flex items-center space-x-2">
            {activeEscalations.length > 0 && (
              <div className="px-2 py-1 bg-error-100 text-error-700 text-xs font-medium rounded-full">
                {activeEscalations.length} pending
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              onClick={() => console.log('Opening escalation settings')}
            />
          </div>
        </div>
        
        <p className="text-sm text-text-secondary mb-4">
          Automatic supervisor notifications for high-value leads requiring attention
        </p>
      </div>

      <div className="px-6 pb-6">
        {/* Pending Escalations */}
        {activeEscalations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
              <Icon name="Clock" size={16} className="mr-2 text-warning-600" />
              Pending Escalations
            </h4>
            <div className="space-y-3">
              {activeEscalations.map((escalation) => (
                <div key={escalation.id} className="p-3 border border-warning-200 bg-warning-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-text-primary">
                          {escalation.leadName}
                        </p>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(escalation.priority)}`}>
                          {escalation.priority}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-text-muted mb-2">
                        <span>{escalation.project}</span>
                        <span>•</span>
                        <span>{formatCurrency(escalation.leadValue)}</span>
                        <span>•</span>
                        <span>{escalation.daysSinceLastContact} days overdue</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-text-muted">Assigned to:</span>
                        <span className="text-text-secondary font-medium">{escalation.assignedTo}</span>
                        <span className="text-text-muted">•</span>
                        <span className="text-text-muted">Rule: {escalation.triggerRule}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        variant="warning"
                        size="sm"
                        iconName="Send"
                        onClick={() => handleManualEscalation(escalation)}
                      >
                        Escalate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Clock"
                        onClick={() => handleSnoozeEscalation(escalation.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notifications */}
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
            <Icon name="Bell" size={16} className="mr-2" />
            Recent Notifications
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <Icon name="Check" size={32} className="text-success-500 mx-auto mb-2" />
                <p className="text-sm text-text-secondary">No recent escalations</p>
                <p className="text-xs text-text-muted">All leads are being followed up on time</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-2 hover:bg-background-secondary rounded-md">
                  <div className={`p-1 rounded-full ${getSeverityColor(notification.severity)}`}>
                    <Icon 
                      name={notification.type === 'escalation_sent' ? 'Send' : 'AlertTriangle'} 
                      size={12} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{notification.message}</p>
                    <p className="text-xs text-text-muted">{formatTimeAgo(notification.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="text-text-muted">
              {escalationRules.filter(r => r.active).length} active rules
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              onClick={() => console.log('Opening detailed escalation settings')}
            >
              Configure Rules
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderEscalation;