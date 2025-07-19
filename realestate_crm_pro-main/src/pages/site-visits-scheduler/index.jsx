import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import VisitSummaryCard from './components/VisitSummaryCard';
import UpcomingVisitsList from './components/UpcomingVisitsList';
import QuickScheduleForm from './components/QuickScheduleForm';
import CalendarView from './components/CalendarView';
import VisitDetailsModal from './components/VisitDetailsModal';
import FilterToolbar from './components/FilterToolbar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SiteVisitsScheduler = () => {
  const location = useLocation();
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    executive: 'all',
    project: 'all'
  });

  // Mock data
  const mockVisits = [
    {
      id: 1,
      clientName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      project: 'Skyline Residences',
      unit: '2BHK - A-1205',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      status: 'scheduled',
      assignedTo: 'John Doe',
      priority: 'high',
      notes: 'Client specifically interested in north-facing units',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      clientName: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      project: 'Marina Heights',
      unit: '3BHK - B-804',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      status: 'completed',
      assignedTo: 'Sarah Smith',
      priority: 'medium',
      notes: 'Family visit with spouse and children',
      feedback: 'Very interested, asked for price negotiation',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      clientName: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit.patel@email.com',
      project: 'Garden View Apartments',
      unit: '2BHK - C-502',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      status: 'no_show',
      assignedTo: 'Mike Johnson',
      priority: 'low',
      notes: 'Reschedule requested due to traffic',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      clientName: 'Sunita Reddy',
      phone: '+91 65432 10987',
      email: 'sunita.reddy@email.com',
      project: 'Downtown Plaza',
      unit: '3BHK - D-1203',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '11:00',
      status: 'scheduled',
      assignedTo: 'Emily Davis',
      priority: 'high',
      notes: 'VIP client - provide premium service',
      createdAt: new Date()
    },
    {
      id: 5,
      clientName: 'Vikram Singh',
      phone: '+91 54321 09876',
      email: 'vikram.singh@email.com',
      project: 'Skyline Residences',
      unit: '1BHK - A-601',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '15:30',
      status: 'scheduled',
      assignedTo: 'David Wilson',
      priority: 'medium',
      notes: 'First-time buyer, needs detailed explanation',
      createdAt: new Date()
    }
  ];

  // Add mock data for prospects, sales executives, and projects
  const mockProspects = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com',
      project: 'Skyline Residences'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
      project: 'Marina Heights'
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit.patel@email.com',
      project: 'Garden View Apartments'
    },
    {
      id: 4,
      name: 'Sunita Reddy',
      phone: '+91 65432 10987',
      email: 'sunita.reddy@email.com',
      project: 'Downtown Plaza'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      phone: '+91 54321 09876',
      email: 'vikram.singh@email.com',
      project: 'Skyline Residences'
    }
  ];

  const mockSalesExecutives = [
    { id: 1, name: 'John Doe', email: 'john.doe@company.com' },
    { id: 2, name: 'Sarah Smith', email: 'sarah.smith@company.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@company.com' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@company.com' }
  ];

  const mockProjects = [
    { id: 1, name: 'Skyline Residences', location: 'Bandra, Mumbai' },
    { id: 2, name: 'Marina Heights', location: 'Worli, Mumbai' },
    { id: 3, name: 'Garden View Apartments', location: 'Andheri, Mumbai' },
    { id: 4, name: 'Downtown Plaza', location: 'Lower Parel, Mumbai' },
    { id: 5, name: 'Sunset Villas', location: 'Juhu, Mumbai' }
  ];

  useEffect(() => {
    setVisits(mockVisits);
    setFilteredVisits(mockVisits);

    // Handle drill-down navigation from dashboard
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'today') {
      const today = new Date().toISOString().split('T')[0];
      setFilters(prev => ({
        ...prev,
        dateFrom: today,
        dateTo: today
      }));
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [filters, visits]);

  const applyFilters = () => {
    let filtered = [...visits];

    // Handle drill-down filter for today's visits
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(visit => visit.date === today);
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(visit => visit.date >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(visit => visit.date <= filters.dateTo);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(visit => visit.status === filters.status);
    }

    // Executive filter
    if (filters.executive !== 'all') {
      filtered = filtered.filter(visit => visit.assignedTo === filters.executive);
    }

    // Project filter
    if (filters.project !== 'all') {
      filtered = filtered.filter(visit => visit.project === filters.project);
    }

    setFilteredVisits(filtered);
  };

  const handleVisitUpdate = (visitId, updates) => {
    setVisits(prev => prev.map(visit => 
      visit.id === visitId ? { ...visit, ...updates } : visit
    ));
  };

  const handleScheduleVisit = (visitData) => {
    const newVisit = {
      id: Date.now(),
      ...visitData,
      createdAt: new Date()
    };
    setVisits(prev => [...prev, newVisit]);
  };

  const handleVisitClick = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const getSummaryStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayVisits = filteredVisits.filter(visit => visit.date === today);
    
    return {
      total: filteredVisits.length,
      today: todayVisits.length,
      completed: filteredVisits.filter(visit => visit.status === 'completed').length,
      scheduled: filteredVisits.filter(visit => visit.status === 'scheduled').length,
      noShow: filteredVisits.filter(visit => visit.status === 'no_show').length
    };
  };

  // Get drill-down context for display
  const getDrillDownContext = () => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'today') {
      return { title: "Today's Site Visits", description: "All site visits scheduled for today" };
    }
    return null;
  };

  const drillDownContext = getDrillDownContext();
  const summaryStats = getSummaryStats();

  return (
    <>
      <Helmet>
        <title>Site Visits Scheduler - RealEstate CRM Pro</title>
        <meta name="description" content="Schedule and manage site visits with automated WhatsApp reminders and outcome tracking" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-8 section-padding">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Icon name="Calendar" size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-text-primary">
                  {drillDownContext ? drillDownContext.title : 'Site Visits Scheduler'}
                </h1>
              </div>
              <p className="text-text-secondary">
                {drillDownContext 
                  ? drillDownContext.description 
                  : 'Schedule, track, and manage site visits with automated reminders'
                }
              </p>
              
              {/* Drill-down breadcrumb */}
              {drillDownContext && (
                <div className="flex items-center space-x-2 mt-2 text-sm">
                  <button 
                    onClick={() => window.history.pushState({}, '', '/site-visits-scheduler')}
                    className="text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    All Site Visits
                  </button>
                  <Icon name="ChevronRight" size={14} className="text-text-muted" />
                  <span className="text-text-secondary">{drillDownContext.title}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                iconName="Download"
                onClick={() => console.log('Exporting site visits data...')}
              >
                Export
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                iconName="Plus"
                onClick={() => console.log('Opening quick schedule form...')}
              >
                Schedule Visit
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <VisitSummaryCard
              title="Total"
              value={summaryStats.total}
              icon="Calendar"
              color="primary"
            />
            <VisitSummaryCard
              title="Today"
              value={summaryStats.today}
              icon="Clock"
              color="warning"
            />
            <VisitSummaryCard
              title="Completed"
              value={summaryStats.completed}
              icon="CheckCircle"
              color="success"
            />
            <VisitSummaryCard
              title="Scheduled"
              value={summaryStats.scheduled}
              icon="Calendar"
              color="primary"
            />
            <VisitSummaryCard
              title="No Show"
              value={summaryStats.noShow}
              icon="XCircle"
              color="error"
            />
          </div>

          {/* Filter Toolbar */}
          <FilterToolbar
            filters={filters}
            onFiltersChange={setFilters}
            totalVisits={visits.length}
            filteredCount={filteredVisits.length}
          />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-text-secondary">View:</span>
              <div className="flex bg-background-secondary rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                    currentView === 'calendar' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="Calendar" size={16} className="mr-1" />
                  Calendar
                </button>
                <button
                  onClick={() => setCurrentView('list')}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                    currentView === 'list' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="List" size={16} className="mr-1" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Schedule Form - Left Sidebar */}
            <div className="lg:col-span-3">
              <QuickScheduleForm
                onSchedule={handleScheduleVisit}
                selectedDate={selectedDate}
                prospects={mockProspects}
                salesExecutives={mockSalesExecutives}
                projects={mockProjects}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {currentView === 'calendar' ? (
                <CalendarView
                  visits={filteredVisits}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  onVisitClick={handleVisitClick}
                />
              ) : (
                <UpcomingVisitsList
                  visits={filteredVisits}
                  onVisitClick={handleVisitClick}
                  onVisitUpdate={handleVisitUpdate}
                />
              )}
            </div>
          </div>
        </main>

        {/* Visit Details Modal */}
        <VisitDetailsModal
          visit={selectedVisit}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVisit(null);
          }}
          onUpdate={handleVisitUpdate}
        />
      </div>
    </>
  );
};

export default SiteVisitsScheduler;