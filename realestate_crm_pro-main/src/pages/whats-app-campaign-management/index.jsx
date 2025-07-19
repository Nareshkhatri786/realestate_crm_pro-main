import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CampaignBuilder from './components/CampaignBuilder';
import ActiveCampaigns from './components/ActiveCampaigns';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const WhatsAppCampaignManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'campaigns', label: 'Active Campaigns', icon: 'MessageCircle' },
    { id: 'builder', label: 'Campaign Builder', icon: 'Plus' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  // Mock data for active campaigns
  const mockCampaigns = [
    {
      id: 1,
      name: 'Welcome Series',
      description: 'Automated welcome sequence for new leads',
      status: 'active',
      audience: {
        type: 'New Leads',
        count: 1245
      },
      metrics: {
        sent: 1245,
        delivered: 1189,
        read: 967,
        replied: 234
      },
      startDate: new Date(Date.now() - 86400000 * 7),
      endDate: null,
      messagePreview: 'Welcome to our real estate family! We are excited to help you find your dream property. Our team will be in touch shortly to understand your requirements.',
      activities: [
        { message: 'Campaign started', timestamp: new Date(Date.now() - 86400000 * 7) },
        { message: '1245 messages sent', timestamp: new Date(Date.now() - 86400000 * 7) },
        { message: '1189 messages delivered', timestamp: new Date(Date.now() - 86400000 * 6) },
        { message: '967 messages read', timestamp: new Date(Date.now() - 86400000 * 5) }
      ]
    },
    {
      id: 2,
      name: 'Property Updates',
      description: 'Weekly property updates and new listings',
      status: 'active',
      audience: {
        type: 'Interested Buyers',
        count: 892
      },
      metrics: {
        sent: 892,
        delivered: 845,
        read: 623,
        replied: 156
      },
      startDate: new Date(Date.now() - 86400000 * 3),
      endDate: new Date(Date.now() + 86400000 * 30),
      messagePreview: 'New property alert! Skyline Residences in Bandra is now available. Premium 2BHK apartments starting from ₹1.2Cr. Book your site visit today!',
      activities: [
        { message: 'Campaign started', timestamp: new Date(Date.now() - 86400000 * 3) },
        { message: '892 messages sent', timestamp: new Date(Date.now() - 86400000 * 3) },
        { message: '845 messages delivered', timestamp: new Date(Date.now() - 86400000 * 2) }
      ]
    },
    {
      id: 3,
      name: 'Site Visit Reminders',
      description: 'Automated reminders for scheduled site visits',
      status: 'active',
      audience: {
        type: 'Site Visit Scheduled',
        count: 567
      },
      metrics: {
        sent: 567,
        delivered: 534,
        read: 445,
        replied: 89
      },
      startDate: new Date(Date.now() - 86400000 * 1),
      endDate: null,
      messagePreview: 'Hi {{name}}, reminder about your site visit tomorrow at {{time}} for {{property_name}}. Our sales executive will meet you at the property location.',
      activities: [
        { message: 'Campaign started', timestamp: new Date(Date.now() - 86400000 * 1) },
        { message: '567 messages sent', timestamp: new Date(Date.now() - 86400000 * 1) },
        { message: '534 messages delivered', timestamp: new Date(Date.now() - 3600000 * 12) }
      ]
    },
    {
      id: 4,
      name: 'Follow-up Sequence',
      description: 'Post site visit follow-up messages',
      status: 'paused',
      audience: {
        type: 'Site Visit Completed',
        count: 423
      },
      metrics: {
        sent: 423,
        delivered: 398,
        read: 298,
        replied: 78
      },
      startDate: new Date(Date.now() - 86400000 * 14),
      endDate: null,
      messagePreview: 'Hi {{name}}, how was your experience visiting {{property_name}}? Any questions or would you like to schedule another visit?',
      activities: [
        { message: 'Campaign paused', timestamp: new Date(Date.now() - 86400000 * 2) },
        { message: '423 messages sent', timestamp: new Date(Date.now() - 86400000 * 14) },
        { message: '398 messages delivered', timestamp: new Date(Date.now() - 86400000 * 13) }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCampaigns = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  const handleSaveCampaign = (campaignData) => {
    const newCampaign = {
      id: campaigns.length + 1,
      ...campaignData,
      status: campaignData.schedule.type === 'immediate' ? 'active' : 'scheduled',
      metrics: {
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0
      },
      startDate: campaignData.schedule.type === 'immediate' ? new Date() : new Date(campaignData.schedule.startDate),
      endDate: campaignData.schedule.endDate ? new Date(campaignData.schedule.endDate) : null,
      messagePreview: 'Campaign message preview will be generated based on selected templates.',
      activities: [
        { message: 'Campaign created', timestamp: new Date() }
      ]
    };

    setCampaigns([...campaigns, newCampaign]);
    setActiveTab('campaigns');
  };

  const handleCampaignAction = (campaign, action) => {
    switch (action) {
      case 'pause':
        setCampaigns(campaigns.map(c => 
          c.id === campaign.id ? { ...c, status: 'paused' } : c
        ));
        break;
      case 'resume':
        setCampaigns(campaigns.map(c => 
          c.id === campaign.id ? { ...c, status: 'active' } : c
        ));
        break;
      case 'duplicate':
        const duplicatedCampaign = {
          ...campaign,
          id: campaigns.length + 1,
          name: `${campaign.name} (Copy)`,
          status: 'draft',
          metrics: { sent: 0, delivered: 0, read: 0, replied: 0 },
          startDate: new Date(),
          activities: [{ message: 'Campaign duplicated', timestamp: new Date() }]
        };
        setCampaigns([...campaigns, duplicatedCampaign]);
        break;
      case 'edit':
        // Navigate to campaign builder with campaign data
        setActiveTab('builder');
        break;
      case 'export':
        // Export campaign report
        console.log('Exporting campaign report:', campaign.name);
        break;
      default:
        break;
    }
  };

  const getTabIcon = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab ? tab.icon : 'Circle';
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalSent = campaigns.reduce((sum, c) => sum + c.metrics.sent, 0);
  const totalDelivered = campaigns.reduce((sum, c) => sum + c.metrics.delivered, 0);
  const totalRead = campaigns.reduce((sum, c) => sum + c.metrics.read, 0);
  const totalReplied = campaigns.reduce((sum, c) => sum + c.metrics.replied, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="section-padding page-padding">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-text-primary mb-2">WhatsApp Campaign Management</h1>
              <p className="text-text-secondary">
                Create, manage, and analyze your WhatsApp marketing campaigns
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Settings"
                onClick={() => {/* Open settings */}}
              >
                Settings
              </Button>
              <Button
                variant="primary"
                iconName="Plus"
                onClick={() => setActiveTab('builder')}
              >
                New Campaign
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Campaigns</p>
                  <p className="text-2xl font-bold text-text-primary">{activeCampaigns.length}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Messages Sent</p>
                  <p className="text-2xl font-bold text-text-primary">{totalSent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="Send" size={20} className="text-success" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Delivery Rate</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-warning" />
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-radius-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Reply Rate</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {totalRead > 0 ? Math.round((totalReplied / totalRead) * 100) : 0}%
                  </p>
                </div>
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="MessageSquare" size={20} className="text-error" />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-surface border border-border rounded-radius-md mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading && activeTab === 'campaigns' ? (
                <div className="text-center py-12">
                  <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-text-secondary">Loading campaigns...</p>
                </div>
              ) : (
                <>
                  {activeTab === 'campaigns' && (
                    <ActiveCampaigns
                      campaigns={campaigns}
                      onCampaignAction={handleCampaignAction}
                    />
                  )}
                  
                  {activeTab === 'builder' && (
                    <CampaignBuilder
                      onSaveCampaign={handleSaveCampaign}
                    />
                  )}
                  
                  {activeTab === 'analytics' && (
                    <AnalyticsDashboard />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WhatsAppCampaignManagement;