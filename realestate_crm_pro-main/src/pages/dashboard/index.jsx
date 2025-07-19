import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import QuickActionCard from './components/QuickActionCard';
import ChartWidget from './components/ChartWidget';
import ActivityFeed from './components/ActivityFeed';
import FollowUpList from './components/FollowUpList';
import OpportunityPipeline from './components/OpportunityPipeline';
import SiteVisitTracker from './components/SiteVisitTracker';
import TopEngagedLeads from './components/TopEngagedLeads';
import ReminderEscalation from './components/ReminderEscalation';
import AddLeadModal from './components/AddLeadModal';
import CreateOpportunityModal from './components/CreateOpportunityModal';
import ScheduleVisitModal from './components/ScheduleVisitModal';

import Button from '../../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isCreateOpportunityModalOpen, setIsCreateOpportunityModalOpen] = useState(false);
  const [isScheduleVisitModalOpen, setIsScheduleVisitModalOpen] = useState(false);

  // Mock data
  const dashboardMetrics = [
    {
      title: "Today\'s Follow-ups",
      value: "24",
      subtitle: "8 completed, 16 pending",
      icon: "Clock",
      color: "primary",
      trend: "up",
      trendValue: "+12%",
      drillDownPath: "/leads-management",
      drillDownFilter: "today-followups"
    },
    {
      title: "Overdue Follow-ups",
      value: "7",
      subtitle: "Requires immediate attention",
      icon: "AlertTriangle",
      color: "error",
      trend: "down",
      trendValue: "-3",
      drillDownPath: "/leads-management",
      drillDownFilter: "overdue-followups"
    },
    {
      title: "Active Opportunities",
      value: "156",
      subtitle: "₹2.4Cr pipeline value",
      icon: "Target",
      color: "success",
      trend: "up",
      trendValue: "+8%",
      drillDownPath: "/opportunities-management",
      drillDownFilter: "active"
    },
    {
      title: "Site Visits Today",
      value: "12",
      subtitle: "9 completed, 3 scheduled",
      icon: "MapPin",
      color: "warning",
      trend: "neutral",
      trendValue: "0%",
      drillDownPath: "/site-visits-scheduler",
      drillDownFilter: "today"
    }
  ];

  const leadSourceData = [
    { name: 'Housing.com', leads: 45, conversions: 12 },
    { name: 'Walk-in', leads: 32, conversions: 18 },
    { name: 'Referral', leads: 28, conversions: 15 },
    { name: 'Social Media', leads: 22, conversions: 8 },
    { name: 'Website', leads: 18, conversions: 6 },
    { name: 'Others', leads: 15, conversions: 4 }
  ];

  const conversionTrendData = [
    { name: 'Jan', leads: 120, conversions: 24 },
    { name: 'Feb', leads: 135, conversions: 28 },
    { name: 'Mar', leads: 148, conversions: 32 },
    { name: 'Apr', leads: 162, conversions: 38 },
    { name: 'May', leads: 178, conversions: 42 },
    { name: 'Jun', leads: 195, conversions: 48 }
  ];

  const whatsappMetricsData = [
    { name: 'Delivered', value: 1245 },
    { name: 'Read', value: 987 },
    { name: 'Replied', value: 234 },
    { name: 'Failed', value: 23 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      user: 'Priya Sharma',
      description: 'Added new lead from Housing.com',
      details: 'Rajesh Kumar - Interested in 2BHK at Skyline Residences',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'call',
      user: 'Amit Patel',
      description: 'Completed follow-up call',
      details: 'Discussed pricing and payment plans with Sunita Devi',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 3,
      type: 'visit',
      user: 'Rohit Singh',
      description: 'Site visit completed',
      details: 'Showed 3BHK unit to Vikram Gupta family',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      type: 'opportunity',
      user: 'Neha Joshi',
      description: 'Moved opportunity to negotiation',
      details: 'Anita Reddy showing strong interest in Marina Heights',
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: 5,
      type: 'booking',
      user: 'Karan Mehta',
      description: 'Booking confirmed!',
      details: 'Deepak Agarwal booked 2BHK for ₹85L',
      timestamp: new Date(Date.now() - 1800000)
    }
  ];

  const followUpData = [
    {
      id: 1,
      type: 'today',
      leadName: 'Ravi Kumar',
      phone: '9876543210',
      project: 'Skyline Residences',
      priority: 'high',
      scheduledTime: new Date().setHours(10, 30)
    },
    {
      id: 2,
      type: 'today',
      leadName: 'Meera Patel',
      phone: '9876543211',
      project: 'Marina Heights',
      priority: 'medium',
      scheduledTime: new Date().setHours(14, 0)
    },
    {
      id: 3,
      type: 'overdue',
      leadName: 'Suresh Gupta',
      phone: '9876543212',
      project: 'Garden View',
      priority: 'high',
      scheduledTime: new Date(Date.now() - 86400000).setHours(11, 0)
    },
    {
      id: 4,
      type: 'overdue',
      leadName: 'Kavita Singh',
      phone: '9876543213',
      project: 'Downtown Plaza',
      priority: 'medium',
      scheduledTime: new Date(Date.now() - 172800000).setHours(15, 30)
    },
    {
      id: 5,
      type: 'upcoming',
      leadName: 'Arjun Reddy',
      phone: '9876543214',
      project: 'Skyline Residences',
      priority: 'low',
      scheduledTime: new Date(Date.now() + 86400000).setHours(9, 0)
    }
  ];

  const opportunityData = [
    {
      id: 1,
      stage: 'scheduled',
      clientName: 'Rajesh Kumar',
      value: 8500000,
      project: 'Skyline Residences'
    },
    {
      id: 2,
      stage: 'visit_done',
      clientName: 'Priya Sharma',
      value: 7200000,
      project: 'Marina Heights'
    },
    {
      id: 3,
      stage: 'negotiation',
      clientName: 'Amit Patel',
      value: 9500000,
      project: 'Garden View'
    },
    {
      id: 4,
      stage: 'booking',
      clientName: 'Sunita Devi',
      value: 6800000,
      project: 'Downtown Plaza'
    },
    {
      id: 5,
      stage: 'lost',
      clientName: 'Vikram Gupta',
      value: 7800000,
      project: 'Skyline Residences'
    }
  ];

  const siteVisitData = [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      clientName: 'Deepak Agarwal',
      phone: '9876543215',
      project: 'Skyline Residences',
      status: 'completed'
    },
    {
      id: 2,
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      clientName: 'Anita Reddy',
      phone: '9876543216',
      project: 'Marina Heights',
      status: 'scheduled'
    },
    {
      id: 3,
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      clientName: 'Manoj Joshi',
      phone: '9876543217',
      project: 'Garden View',
      status: 'no_show'
    }
  ];

  const quickActions = [
    {
      label: 'Add New Lead',
      icon: 'UserPlus',
      variant: 'primary',
      onClick: () => setIsAddLeadModalOpen(true)
    },
    {
      label: 'Create Opportunity',
      icon: 'Target',
      variant: 'success',
      onClick: () => setIsCreateOpportunityModalOpen(true)
    },
    {
      label: 'Schedule Site Visit',
      icon: 'Calendar',
      variant: 'secondary',
      onClick: () => setIsScheduleVisitModalOpen(true)
    },
    {
      label: 'View Analytics',
      icon: 'BarChart3',
      variant: 'outline',
      onClick: () => navigate('/analytics-reports')
    }
  ];

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleFollowUpComplete = (followUpId) => {
    console.log('Completing follow-up:', followUpId);
    // In real app, this would update the follow-up status
  };

  // Modal handlers
  const handleLeadAdded = (newLead) => {
    console.log('Lead added:', newLead);
    // In real app, this would update the leads data and refresh metrics
  };

  const handleOpportunityCreated = (newOpportunity) => {
    console.log('Opportunity created:', newOpportunity);
    // In real app, this would update the opportunities data and refresh metrics
  };

  const handleVisitScheduled = (newVisit) => {
    console.log('Visit scheduled:', newVisit);
    // In real app, this would update the visits data and refresh metrics
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="section-padding page-padding">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
              <p className="text-text-secondary">
                Welcome back! Here's what's happening with your sales today.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {refreshing && (
                <div className="flex items-center space-x-2 text-text-muted">
                  <div className="loading-spinner w-4 h-4"></div>
                  <span className="text-sm">Refreshing...</span>
                </div>
              )}
              <Button
                variant="outline"
                iconName="RefreshCw"
                onClick={() => {
                  setRefreshing(true);
                  setTimeout(() => setRefreshing(false), 1000);
                }}
              >
                Refresh
              </Button>
              <Button
                variant="primary"
                iconName="Plus"
                onClick={() => setIsAddLeadModalOpen(true)}
              >
                Add Lead
              </Button>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Quick Actions */}
            <div className="lg:col-span-3">
              <QuickActionCard
                title="Quick Actions"
                description="Frequently used actions for faster workflow"
                actions={quickActions}
                className="mb-6"
              />
              
              {/* Top Engaged Leads Widget */}
              <TopEngagedLeads className="mb-6" />
              
              {/* Activity Feed */}
              <ActivityFeed 
                activities={recentActivities}
                className="hidden lg:block"
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {/* Top Metrics Row - Now with clickable drill-downs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {dashboardMetrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    {...metric}
                    loading={loading}
                  />
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartWidget
                  title="Lead Source Performance"
                  type="bar"
                  data={leadSourceData}
                  dataKey="leads"
                  xAxisKey="name"
                  color="#3B82F6"
                  height={300}
                />
                
                <ChartWidget
                  title="Conversion Trends"
                  type="line"
                  data={conversionTrendData}
                  dataKey="conversions"
                  xAxisKey="name"
                  color="#10B981"
                  height={300}
                />
              </div>

              {/* WhatsApp Metrics & Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ChartWidget
                  title="WhatsApp Message Metrics"
                  type="pie"
                  data={whatsappMetricsData}
                  dataKey="value"
                  xAxisKey="name"
                  height={300}
                  showFilters={false}
                />
                
                <OpportunityPipeline 
                  opportunities={opportunityData}
                />
              </div>

              {/* Follow-ups & Escalations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <FollowUpList
                  followUps={followUpData}
                  onFollowUpComplete={handleFollowUpComplete}
                />
                
                <ReminderEscalation />
              </div>

              {/* Site Visits Tracker */}
              <div className="grid grid-cols-1 gap-6 mb-6">
                <SiteVisitTracker
                  visits={siteVisitData}
                />
              </div>

              {/* Mobile Activity Feed */}
              <div className="lg:hidden">
                <ActivityFeed activities={recentActivities} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />

      <CreateOpportunityModal
        isOpen={isCreateOpportunityModalOpen}
        onClose={() => setIsCreateOpportunityModalOpen(false)}
        onOpportunityCreated={handleOpportunityCreated}
      />

      <ScheduleVisitModal
        isOpen={isScheduleVisitModalOpen}
        onClose={() => setIsScheduleVisitModalOpen(false)}
        onVisitScheduled={handleVisitScheduled}
      />
    </div>
  );
};

export default Dashboard;