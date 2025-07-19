import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPICard from './components/KPICard';
import FilterSidebar from './components/FilterSidebar';
import LeadTrendsChart from './components/LeadTrendsChart';
import SourcePerformanceChart from './components/SourcePerformanceChart';
import ConversionFunnelChart from './components/ConversionFunnelChart';
import TeamLeaderboard from './components/TeamLeaderboard';
import WhatsAppAnalytics from './components/WhatsAppAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AnalyticsReports = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    teamMember: 'all',
    project: 'all',
    reportTypes: [
      { id: 'leads', label: 'Lead Analytics', checked: true },
      { id: 'opportunities', label: 'Opportunity Analytics', checked: true },
      { id: 'visits', label: 'Site Visit Analytics', checked: true },
      { id: 'whatsapp', label: 'WhatsApp Analytics', checked: false },
      { id: 'team', label: 'Team Performance', checked: true }
    ]
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const kpiData = [
    {
      title: 'Lead Conversion Rate',
      value: '18.4%',
      change: '+2.3%',
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: [12, 15, 18, 16, 20, 18, 22, 19, 24, 21, 25, 23, 28, 26]
    },
    {
      title: 'Avg. Opportunity Age',
      value: '12.5 days',
      change: '-1.2 days',
      changeType: 'positive',
      icon: 'Clock',
      trend: [15, 14, 16, 13, 15, 12, 14, 11, 13, 12, 11, 13, 12, 10]
    },
    {
      title: 'Team Activity Score',
      value: '87.2%',
      change: '+5.1%',
      changeType: 'positive',
      icon: 'Users',
      trend: [78, 82, 79, 85, 83, 87, 84, 89, 86, 91, 88, 92, 89, 87]
    },
    {
      title: 'Revenue This Month',
      value: '₹2.45Cr',
      change: '+12.8%',
      changeType: 'positive',
      icon: 'DollarSign',
      trend: [180, 195, 210, 205, 225, 220, 240, 235, 250, 245, 260, 255, 270, 245]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'leads', label: 'Lead Analytics', icon: 'Users' },
    { id: 'opportunities', label: 'Opportunities', icon: 'Target' },
    { id: 'team', label: 'Team Performance', icon: 'Award' },
    { id: 'whatsapp', label: 'WhatsApp Analytics', icon: 'MessageSquare' }
  ];

  useEffect(() => {
    // Simulate data loading when filters change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    if (newFilters.reset) {
      setFilters({
        dateRange: 'last30days',
        startDate: '',
        endDate: '',
        teamMember: 'all',
        project: 'all',
        reportTypes: [
          { id: 'leads', label: 'Lead Analytics', checked: true },
          { id: 'opportunities', label: 'Opportunity Analytics', checked: true },
          { id: 'visits', label: 'Site Visit Analytics', checked: true },
          { id: 'whatsapp', label: 'WhatsApp Analytics', checked: false },
          { id: 'team', label: 'Team Performance', checked: true }
        ]
      });
    } else {
      setFilters(newFilters);
    }
  };

  const handleExport = (format) => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Exporting report as ${format.toUpperCase()}...`);
    }, 1000);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LeadTrendsChart />
        <SourcePerformanceChart />
      </div>

      <ConversionFunnelChart />
      <TeamLeaderboard />
    </div>
  );

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Leads"
          value="1,245"
          change="+8.2%"
          changeType="positive"
          icon="Users"
          trend={[45, 52, 48, 61, 55, 67, 59, 73, 68, 71, 64, 78, 82, 75]}
        />
        <KPICard
          title="Qualified Leads"
          value="892"
          change="+12.1%"
          changeType="positive"
          icon="UserCheck"
          trend={[32, 38, 35, 42, 39, 48, 41, 52, 47, 49, 44, 56, 61, 53]}
        />
        <KPICard
          title="Conversion Rate"
          value="18.4%"
          change="+2.3%"
          changeType="positive"
          icon="TrendingUp"
          trend={[16, 17, 15, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21, 18]}
        />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LeadTrendsChart title="Lead Generation Trends - Detailed View" />
        <SourcePerformanceChart />
      </div>
    </div>
  );

  const renderOpportunitiesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Active Opportunities"
          value="298"
          change="+5.7%"
          changeType="positive"
          icon="Target"
          trend={[25, 28, 26, 32, 29, 35, 31, 38, 34, 36, 33, 39, 41, 37]}
        />
        <KPICard
          title="Avg. Deal Size"
          value="₹18.5L"
          change="+3.2%"
          changeType="positive"
          icon="DollarSign"
          trend={[16, 17, 15, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21, 18]}
        />
        <KPICard
          title="Close Rate"
          value="52.3%"
          change="+1.8%"
          changeType="positive"
          icon="CheckCircle"
          trend={[48, 50, 47, 52, 49, 54, 51, 56, 53, 55, 52, 57, 59, 52]}
        />
      </div>
      
      <ConversionFunnelChart />
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Team Members"
          value="12"
          change="+2"
          changeType="positive"
          icon="Users"
        />
        <KPICard
          title="Avg. Performance"
          value="87.2%"
          change="+5.1%"
          changeType="positive"
          icon="Award"
        />
        <KPICard
          title="Top Performer"
          value="Sarah J."
          change="₹28.5L"
          changeType="positive"
          icon="Crown"
        />
        <KPICard
          title="Team Revenue"
          value="₹2.45Cr"
          change="+12.8%"
          changeType="positive"
          icon="DollarSign"
        />
      </div>
      
      <TeamLeaderboard />
    </div>
  );

  const renderWhatsAppTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Messages Sent"
          value="3,456"
          change="+15.2%"
          changeType="positive"
          icon="MessageSquare"
        />
        <KPICard
          title="Delivery Rate"
          value="94.8%"
          change="+1.2%"
          changeType="positive"
          icon="CheckCircle"
        />
        <KPICard
          title="Response Rate"
          value="31.3%"
          change="+4.7%"
          changeType="positive"
          icon="MessageCircle"
        />
        <KPICard
          title="Engagement Score"
          value="78.5%"
          change="+6.3%"
          changeType="positive"
          icon="TrendingUp"
        />
      </div>
      
      <WhatsAppAnalytics />
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'leads': return renderLeadsTab();
      case 'opportunities': return renderOpportunitiesTab();
      case 'team': return renderTeamTab();
      case 'whatsapp': return renderWhatsAppTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex pt-16">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">Analytics & Reports</h1>
                  <p className="text-text-secondary mt-1">
                    Comprehensive performance insights and data visualization
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    iconName="RefreshCw"
                    iconPosition="left"
                    disabled={isLoading}
                  >
                    Refresh Data
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    iconName="Download"
                    iconPosition="left"
                    disabled={isLoading}
                  >
                    Export Report
                  </Button>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 mt-6 border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon name={tab.icon} size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                <div className="bg-surface rounded-lg p-6 flex items-center space-x-3">
                  <div className="loading-spinner w-6 h-6" />
                  <span className="text-text-primary">Loading analytics data...</span>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="space-y-6">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;