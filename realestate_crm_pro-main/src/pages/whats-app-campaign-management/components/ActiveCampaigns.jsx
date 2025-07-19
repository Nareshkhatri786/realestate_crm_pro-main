import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveCampaigns = ({ campaigns, onCampaignAction, className = '' }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700';
      case 'paused':
        return 'bg-warning-100 text-warning-700';
      case 'completed':
        return 'bg-secondary-100 text-secondary-700';
      case 'draft':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCampaignAction = (campaign, action) => {
    onCampaignAction?.(campaign, action);
  };

  const handleViewDetails = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailsModal(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Campaign Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-surface border border-border rounded-radius-md p-6 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">{campaign.name}</h3>
                <p className="text-sm text-text-secondary">{campaign.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                    onClick={() => {/* Toggle dropdown */}}
                  />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{campaign.metrics.sent}</p>
                <p className="text-xs text-text-secondary">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{campaign.metrics.delivered}</p>
                <p className="text-xs text-text-secondary">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{campaign.metrics.read}</p>
                <p className="text-xs text-text-secondary">Read</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{campaign.metrics.replied}</p>
                <p className="text-xs text-text-secondary">Replied</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Progress</span>
                <span className="text-sm font-medium text-text-primary">
                  {Math.round((campaign.metrics.delivered / campaign.metrics.sent) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(campaign.metrics.delivered / campaign.metrics.sent) * 100}%` }}
                />
              </div>
            </div>

            {/* Campaign Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Audience:</span>
                <span className="text-text-primary">{campaign.audience.type} ({campaign.audience.count} contacts)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Started:</span>
                <span className="text-text-primary">{formatDate(campaign.startDate)}</span>
              </div>
              {campaign.endDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Ends:</span>
                  <span className="text-text-primary">{formatDate(campaign.endDate)}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(campaign)}
              >
                View Details
              </Button>
              <div className="flex items-center space-x-2">
                {campaign.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCampaignAction(campaign, 'pause')}
                    iconName="Pause"
                  />
                )}
                {campaign.status === 'paused' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCampaignAction(campaign, 'resume')}
                    iconName="Play"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCampaignAction(campaign, 'duplicate')}
                  iconName="Copy"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCampaignAction(campaign, 'edit')}
                  iconName="Edit"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <Icon name="MessageCircle" size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Active Campaigns</h3>
          <p className="text-text-secondary">Create your first WhatsApp campaign to get started</p>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showDetailsModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowDetailsModal(false)} />
            
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-radius-lg sm:align-middle">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary">{selectedCampaign.name}</h2>
                  <p className="text-text-secondary">{selectedCampaign.description}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-background-secondary rounded-md transition-colors duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Performance Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background-secondary rounded-radius-md p-4">
                        <div className="text-2xl font-bold text-text-primary">{selectedCampaign.metrics.sent}</div>
                        <div className="text-sm text-text-secondary">Messages Sent</div>
                        <div className="text-xs text-success mt-1">100%</div>
                      </div>
                      <div className="bg-background-secondary rounded-radius-md p-4">
                        <div className="text-2xl font-bold text-success">{selectedCampaign.metrics.delivered}</div>
                        <div className="text-sm text-text-secondary">Delivered</div>
                        <div className="text-xs text-success mt-1">
                          {Math.round((selectedCampaign.metrics.delivered / selectedCampaign.metrics.sent) * 100)}%
                        </div>
                      </div>
                      <div className="bg-background-secondary rounded-radius-md p-4">
                        <div className="text-2xl font-bold text-primary">{selectedCampaign.metrics.read}</div>
                        <div className="text-sm text-text-secondary">Read</div>
                        <div className="text-xs text-primary mt-1">
                          {Math.round((selectedCampaign.metrics.read / selectedCampaign.metrics.delivered) * 100)}%
                        </div>
                      </div>
                      <div className="bg-background-secondary rounded-radius-md p-4">
                        <div className="text-2xl font-bold text-warning">{selectedCampaign.metrics.replied}</div>
                        <div className="text-sm text-text-secondary">Replied</div>
                        <div className="text-xs text-warning mt-1">
                          {Math.round((selectedCampaign.metrics.replied / selectedCampaign.metrics.read) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Campaign Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCampaign.status)}`}>
                          {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Audience Type:</span>
                        <span className="text-sm font-medium text-text-primary">{selectedCampaign.audience.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Total Recipients:</span>
                        <span className="text-sm font-medium text-text-primary">{selectedCampaign.audience.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Started:</span>
                        <span className="text-sm font-medium text-text-primary">{formatDate(selectedCampaign.startDate)}</span>
                      </div>
                      {selectedCampaign.endDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">Ends:</span>
                          <span className="text-sm font-medium text-text-primary">{formatDate(selectedCampaign.endDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Message Preview</h3>
                  <div className="bg-background-secondary rounded-radius-md p-4">
                    <p className="text-text-primary">{selectedCampaign.messagePreview}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Recent Activity</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCampaign.activities?.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-background-secondary rounded-radius">
                        <Icon name="MessageCircle" size={16} className="text-primary" />
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">{activity.message}</p>
                          <p className="text-xs text-text-secondary">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => handleCampaignAction(selectedCampaign, 'export')}
                  iconName="Download"
                >
                  Export Report
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleCampaignAction(selectedCampaign, 'edit')}
                  iconName="Edit"
                >
                  Edit Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveCampaigns;