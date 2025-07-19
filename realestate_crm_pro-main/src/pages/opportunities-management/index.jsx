import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FilterToolbar from './components/FilterToolbar';
import StatsSidebar from './components/StatsSidebar';
import StageColumn from './components/StageColumn';
import OpportunityModal from './components/OpportunityModal';
import MobileStageView from './components/MobileStageView';

import Button from '../../components/ui/Button';

const OpportunitiesManagement = () => {
  const location = useLocation();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    executive: 'All Executives',
    propertyType: 'All Types',
    priority: 'All Priorities',
    aging: 'All Ages',
    dateRange: null
  });

  const stages = ['Scheduled', 'Visit Done', 'Negotiation', 'Booking', 'Lost'];

  // Mock data
  const mockOpportunities = [
    {
      id: 1,
      clientName: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      location: "Whitefield, Bangalore",
      propertyType: "3 BHK",
      budget: 8500000,
      stage: "Scheduled",
      stageDate: "2024-01-15T10:00:00Z",
      priority: "High",
      assignedTo: "John Doe",
      nextAction: "Site visit scheduled",
      nextActionDate: "2024-01-20T14:00:00Z",
      lastContact: "2024-01-15T10:00:00Z",
      nurtureActive: true,
      source: "Housing.com",
      notes: [
        {
          id: 1,
          content: "Client is very interested in 3 BHK apartments with good amenities",
          timestamp: "2024-01-15T10:00:00Z",
          author: "John Doe"
        }
      ]
    },
    {
      id: 2,
      clientName: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      location: "Electronic City, Bangalore",
      propertyType: "2 BHK",
      budget: 6200000,
      stage: "Visit Done",
      stageDate: "2024-01-12T15:30:00Z",
      priority: "Medium",
      assignedTo: "Sarah Smith",
      nextAction: "Follow-up call for feedback",
      nextActionDate: "2024-01-18T11:00:00Z",
      lastContact: "2024-01-16T09:30:00Z",
      nurtureActive: true,
      source: "Direct Inquiry",
      notes: []
    },
    {
      id: 3,
      clientName: "Amit Patel",
      phone: "+91 76543 21098",
      email: "amit.patel@email.com",
      location: "Hebbal, Bangalore",
      propertyType: "4 BHK",
      budget: 12000000,
      stage: "Negotiation",
      stageDate: "2024-01-10T16:45:00Z",
      priority: "High",
      assignedTo: "Mike Johnson",
      nextAction: "Price negotiation meeting",
      nextActionDate: "2024-01-19T15:00:00Z",
      lastContact: "2024-01-17T14:20:00Z",
      nurtureActive: true,
      source: "Referral",
      notes: [
        {
          id: 2,
          content: "Client wants 10% discount on the quoted price",
          timestamp: "2024-01-17T14:20:00Z",
          author: "Mike Johnson"
        }
      ]
    },
    {
      id: 4,
      clientName: "Sneha Reddy",
      phone: "+91 65432 10987",
      email: "sneha.reddy@email.com",
      location: "Koramangala, Bangalore",
      propertyType: "2 BHK",
      budget: 7800000,
      stage: "Booking",
      stageDate: "2024-01-08T12:15:00Z",
      priority: "High",
      assignedTo: "Emily Davis",
      nextAction: "Documentation completion",
      nextActionDate: "2024-01-22T10:00:00Z",
      lastContact: "2024-01-18T16:45:00Z",
      nurtureActive: false,
      source: "Housing.com",
      notes: []
    },
    {
      id: 5,
      clientName: "Vikram Singh",
      phone: "+91 54321 09876",
      email: "vikram.singh@email.com",
      location: "Indiranagar, Bangalore",
      propertyType: "1 BHK",
      budget: 4500000,
      stage: "Lost",
      stageDate: "2024-01-05T09:30:00Z",
      priority: "Low",
      assignedTo: "David Wilson",
      nextAction: "Archive opportunity",
      nextActionDate: "2024-01-25T17:00:00Z",
      lastContact: "2024-01-14T11:30:00Z",
      nurtureActive: false,
      source: "Walk-in",
      notes: [
        {
          id: 3,
          content: "Client found better deal elsewhere",
          timestamp: "2024-01-14T11:30:00Z",
          author: "David Wilson"
        }
      ]
    },
    {
      id: 6,
      clientName: "Anita Gupta",
      phone: "+91 43210 98765",
      email: "anita.gupta@email.com",
      location: "Marathahalli, Bangalore",
      propertyType: "3 BHK",
      budget: 9200000,
      stage: "Scheduled",
      stageDate: "2024-01-16T14:20:00Z",
      priority: "Medium",
      assignedTo: "John Doe",
      nextAction: "Site visit this weekend",
      nextActionDate: "2024-01-21T10:30:00Z",
      lastContact: "2024-01-16T14:20:00Z",
      nurtureActive: true,
      source: "Social Media",
      notes: []
    },
    {
      id: 7,
      clientName: "Ravi Krishnan",
      phone: "+91 32109 87654",
      email: "ravi.krishnan@email.com",
      location: "JP Nagar, Bangalore",
      propertyType: "Villa",
      budget: 18500000,
      stage: "Negotiation",
      stageDate: "2024-01-11T11:45:00Z",
      priority: "High",
      assignedTo: "Sarah Smith",
      nextAction: "Final price discussion",
      nextActionDate: "2024-01-20T16:30:00Z",
      lastContact: "2024-01-18T13:15:00Z",
      nurtureActive: true,
      source: "Housing.com",
      notes: []
    },
    {
      id: 8,
      clientName: "Deepika Nair",
      phone: "+91 21098 76543",
      email: "deepika.nair@email.com",
      location: "Bellandur, Bangalore",
      propertyType: "2 BHK",
      budget: 7200000,
      stage: "Visit Done",
      stageDate: "2024-01-13T16:00:00Z",
      priority: "Medium",
      assignedTo: "Mike Johnson",
      nextAction: "Send property brochure",
      nextActionDate: "2024-01-19T09:00:00Z",
      lastContact: "2024-01-17T10:45:00Z",
      nurtureActive: true,
      source: "Referral",
      notes: []
    }
  ];

  // Mock stats
  const mockStats = {
    total: {
      count: 8,
      value: 73900000
    },
    stages: [
      { name: 'Scheduled', count: 2, value: 17700000 },
      { name: 'Visit Done', count: 2, value: 13400000 },
      { name: 'Negotiation', count: 2, value: 30500000 },
      { name: 'Booking', count: 1, value: 7800000 },
      { name: 'Lost', count: 1, value: 4500000 }
    ],
    conversions: {
      visitToBooking: { rate: 25, trend: 5 },
      negotiationSuccess: { rate: 60, trend: -2 }
    },
    avgTimeInStage: [
      { stage: 'Scheduled', days: 3 },
      { stage: 'Visit Done', days: 5 },
      { stage: 'Negotiation', days: 12 },
      { stage: 'Booking', days: 8 },
      { stage: 'Lost', days: 15 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOpportunities(mockOpportunities);
      setFilteredOpportunities(mockOpportunities);
      setIsLoading(false);
    }, 1000);

    // Handle drill-down navigation from dashboard
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'active') {
      // Filter for active opportunities (not lost or completed)
      setFilters(prev => ({
        ...prev,
        search: '',
        executive: 'All Executives'
      }));
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [filters, opportunities]);

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Handle drill-down filter for active opportunities
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'active') {
      filtered = filtered.filter(opp => !['Lost'].includes(opp.stage));
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.clientName.toLowerCase().includes(searchTerm) ||
        opp.phone.includes(searchTerm) ||
        opp.location.toLowerCase().includes(searchTerm) ||
        opp.email.toLowerCase().includes(searchTerm)
      );
    }

    // Executive filter
    if (filters.executive !== 'All Executives') {
      filtered = filtered.filter(opp => opp.assignedTo === filters.executive);
    }

    // Property type filter
    if (filters.propertyType !== 'All Types') {
      filtered = filtered.filter(opp => opp.propertyType === filters.propertyType);
    }

    // Priority filter
    if (filters.priority !== 'All Priorities') {
      filtered = filtered.filter(opp => opp.priority === filters.priority);
    }

    // Aging filter
    if (filters.aging !== 'All Ages') {
      const now = new Date();
      filtered = filtered.filter(opp => {
        const stageDate = new Date(opp.stageDate);
        const daysDiff = Math.floor((now - stageDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.aging) {
          case 'New (0-7 days)': return daysDiff <= 7;
          case 'Fresh (8-15 days)': return daysDiff >= 8 && daysDiff <= 15;
          case 'Warm (16-30 days)': return daysDiff >= 16 && daysDiff <= 30;
          case 'Cold (31-60 days)': return daysDiff >= 31 && daysDiff <= 60;
          case 'Stale (60+ days)': return daysDiff > 60;
          default: return true;
        }
      });
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(opp => {
        const oppDate = new Date(opp.stageDate);
        return oppDate >= startDate && oppDate <= endDate;
      });
    }

    setFilteredOpportunities(filtered);
  };

  const handleStageChange = (opportunityId, newStage) => {
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === opportunityId) {
        return {
          ...opp,
          stage: newStage,
          stageDate: new Date().toISOString()
        };
      }
      return opp;
    });

    setOpportunities(updatedOpportunities);
    
    // Show success notification (in real app, this would be a toast)
    console.log(`Opportunity moved to ${newStage} stage`);
  };

  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOpportunity(null);
  };

  const handleOpportunityUpdate = (updatedOpportunity) => {
    const updatedOpportunities = opportunities.map(opp => 
      opp.id === updatedOpportunity.id ? updatedOpportunity : opp
    );
    setOpportunities(updatedOpportunities);
  };

  const handleNurtureToggle = (opportunityId, isActive) => {
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, nurtureActive: isActive };
      }
      return opp;
    });
    setOpportunities(updatedOpportunities);
  };

  const handleExport = () => {
    // In real app, this would generate and download a CSV/Excel file
    console.log('Exporting opportunities data...');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOpportunities([...mockOpportunities]);
      setIsLoading(false);
    }, 500);
  };

  const handleStageFilter = (stageName) => {
    setFilters({
      ...filters,
      search: stageName === 'All' ? '' : stageName
    });
  };

  const getOpportunitiesByStage = (stage) => {
    return filteredOpportunities.filter(opp => opp.stage === stage);
  };

  const getStageStats = (stage) => {
    const stageOpportunities = getOpportunitiesByStage(stage);
    const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.budget, 0);
    const avgDays = stageOpportunities.length > 0 
      ? Math.round(stageOpportunities.reduce((sum, opp) => {
          const days = Math.floor((new Date() - new Date(opp.stageDate)) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / stageOpportunities.length)
      : 0;

    return { totalValue, avgDays };
  };

  // Get drill-down context for display
  const getDrillDownContext = () => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam === 'active') {
      return { title: "Active Opportunities", description: "All opportunities currently in the sales pipeline" };
    }
    return null;
  };

  const drillDownContext = getDrillDownContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-8 section-padding">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading opportunities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-8 section-padding">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              {drillDownContext ? drillDownContext.title : 'Opportunities Management'}
            </h1>
            <p className="text-text-secondary">
              {drillDownContext 
                ? drillDownContext.description 
                : 'Manage and track your sales opportunities through the pipeline'
              }
            </p>
            
            {/* Drill-down breadcrumb */}
            {drillDownContext && (
              <div className="flex items-center space-x-2 mt-2 text-sm">
                <button 
                  onClick={() => window.history.pushState({}, '', '/opportunities-management')}
                  className="text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  All Opportunities
                </button>
                <span className="text-text-muted">›</span>
                <span className="text-text-secondary">{drillDownContext.title}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" iconName="Plus">
              Add Opportunity
            </Button>
            <Button variant="primary" size="sm" iconName="Download">
              Export Report
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          onRefresh={handleRefresh}
          totalOpportunities={opportunities.length}
          filteredCount={filteredOpportunities.length}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Stats Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <StatsSidebar 
              stats={mockStats} 
              onStageFilter={handleStageFilter}
            />
          </div>

          {/* Kanban Board - Desktop */}
          <div className="flex-1">
            <div className="hidden lg:block">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {stages.map((stage) => (
                  <StageColumn
                    key={stage}
                    stage={stage}
                    opportunities={getOpportunitiesByStage(stage)}
                    onStageChange={handleStageChange}
                    onCardClick={handleCardClick}
                    onNurtureToggle={handleNurtureToggle}
                    stageStats={getStageStats(stage)}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Stage View */}
            <MobileStageView
              opportunities={filteredOpportunities}
              onStageChange={handleStageChange}
              onCardClick={handleCardClick}
              onNurtureToggle={handleNurtureToggle}
            />
          </div>
        </div>

        {/* Mobile Stats - Show below main content on mobile */}
        <div className="lg:hidden mt-6">
          <StatsSidebar 
            stats={mockStats} 
            onStageFilter={handleStageFilter}
          />
        </div>
      </div>

      {/* Opportunity Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleOpportunityUpdate}
      />
    </div>
  );
};

export default OpportunitiesManagement;