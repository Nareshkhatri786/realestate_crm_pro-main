import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TopEngagedLeads = ({ className = '' }) => {
  // Mock data for top engaged leads based on WhatsApp activity
  const topEngagedLeads = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      project: 'Skyline Residences',
      engagementScore: 95,
      whatsappActivity: {
        messagesReceived: 18,
        messagesReplied: 16,
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        avgResponseTime: '15 mins'
      },
      priority: 'high',
      status: 'negotiation'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      project: 'Marina Heights',
      engagementScore: 88,
      whatsappActivity: {
        messagesReceived: 14,
        messagesReplied: 12,
        lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        avgResponseTime: '8 mins'
      },
      priority: 'high',
      status: 'qualified'
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      project: 'Garden View',
      engagementScore: 82,
      whatsappActivity: {
        messagesReceived: 12,
        messagesReplied: 10,
        lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        avgResponseTime: '22 mins'
      },
      priority: 'medium',
      status: 'nurturing'
    },
    {
      id: 4,
      name: 'Sunita Reddy',
      phone: '+91 65432 10987',
      project: 'Downtown Plaza',
      engagementScore: 76,
      whatsappActivity: {
        messagesReceived: 10,
        messagesReplied: 8,
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        avgResponseTime: '45 mins'
      },
      priority: 'medium',
      status: 'contacted'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      phone: '+91 54321 09876',
      project: 'Skyline Residences',
      engagementScore: 71,
      whatsappActivity: {
        messagesReceived: 9,
        messagesReplied: 6,
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        avgResponseTime: '1.2 hrs'
      },
      priority: 'low',
      status: 'new'
    }
  ];

  const getEngagementColor = (score) => {
    if (score >= 90) return 'text-success-600 bg-success-100';
    if (score >= 75) return 'text-warning-600 bg-warning-100';
    return 'text-secondary-600 bg-secondary-100';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error-600 bg-error-100';
      case 'medium': return 'text-warning-600 bg-warning-100';
      case 'low': return 'text-success-600 bg-success-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleCallAction = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleWhatsAppAction = (phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${cleanPhone}`);
  };

  const handleViewProfile = (leadId) => {
    // Navigate to lead profile or open modal
    console.log('Viewing lead profile:', leadId);
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Top Engaged Leads</h3>
          </div>
          <div className="flex items-center space-x-1 text-xs text-text-muted">
            <Icon name="MessageSquare" size={14} />
            <span>WhatsApp Activity</span>
          </div>
        </div>
        
        <p className="text-sm text-text-secondary mb-4">
          Leads with highest WhatsApp engagement - prioritize for outreach
        </p>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {topEngagedLeads.map((lead, index) => (
            <div key={lead.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg hover:bg-background-tertiary transition-colors duration-200">
              <div className="flex items-center space-x-3 flex-1">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700': 'bg-secondary-100 text-secondary-700'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {lead.name}
                    </p>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEngagementColor(lead.engagementScore)}`}>
                      {lead.engagementScore}%
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-text-muted mb-1">
                    <span>{lead.project}</span>
                    <span>•</span>
                    <div className={`px-1.5 py-0.5 rounded text-xs ${getPriorityColor(lead.priority)}`}>
                      {lead.priority}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-text-muted">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={12} />
                      <span>{lead.whatsappActivity.messagesReplied}/{lead.whatsappActivity.messagesReceived}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{formatLastActivity(lead.whatsappActivity.lastActivity)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Timer" size={12} />
                      <span>{lead.whatsappActivity.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Phone"
                  onClick={() => handleCallAction(lead.phone)}
                  className="p-1 h-7 w-7"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MessageSquare"
                  onClick={() => handleWhatsAppAction(lead.phone)}
                  className="p-1 h-7 w-7 text-green-600 hover:text-green-700"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="User"
                  onClick={() => handleViewProfile(lead.id)}
                  className="p-1 h-7 w-7"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            className="w-full"
            onClick={() => {
              // Navigate to leads management with engagement filter
              window.location.href = '/leads-management?filter=engagement';
            }}
          >
            View All Engaged Leads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopEngagedLeads;