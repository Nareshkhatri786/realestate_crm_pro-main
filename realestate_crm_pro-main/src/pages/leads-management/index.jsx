import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import Header from '../../components/ui/Header';
import LeadFilters from './components/LeadFilters';
import LeadActionBar from './components/LeadActionBar';
import LeadTable from './components/LeadTable';
import LeadProfileModal from './components/LeadProfileModal';
import MobileLeadCard from './components/MobileLeadCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const API_URL = "http://localhost:5000/api/leads";

const LeadsManagement = () => {
  const location = useLocation();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(20);

  // Fetch leads from backend
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setLeads(res.data);
        setFilteredLeads(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch leads:", err);
      });

    // Check for mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle drill-down navigation from dashboard
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      let initialFilters = {};
      switch (filterParam) {
        case 'today-followups':
          initialFilters = { followUpStatus: ['today'] };
          break;
        case 'overdue-followups':
          initialFilters = { followUpStatus: ['overdue'] };
          break;
        case 'engagement':
          // Filter for highly engaged leads (high nurturing progress)
          initialFilters = { nurturingProgress: { min: 70 } };
          break;
        default:
          break;
      }
      setFilters(initialFilters);
    }

    return () => window.removeEventListener('resize', checkMobile);
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    // Apply filters
    let filtered = leads;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.sources && filters.sources.length > 0) {
      filtered = filtered.filter(lead =>
        filters.sources.some(source => lead.source?.toLowerCase().includes(source))
      );
    }

    if (filters.projects && filters.projects.length > 0) {
      filtered = filtered.filter(lead =>
        filters.projects.some(project => lead.project?.toLowerCase().includes(project))
      );
    }

    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(lead =>
        filters.statuses.includes(lead.status)
      );
    }

    if (filters.assignment && filters.assignment.length > 0) {
      filtered = filtered.filter(lead => {
        if (filters.assignment.includes('assigned') && lead.assignedTo) return true;
        if (filters.assignment.includes('unassigned') && !lead.assignedTo) return true;
        return false;
      });
    }

    // New filter for follow-up status
    if (filters.followUpStatus && filters.followUpStatus.length > 0) {
      filtered = filtered.filter(lead =>
        filters.followUpStatus.includes(lead.followUpStatus)
      );
    }

    // New filter for nurturing progress
    if (filters.nurturingProgress) {
      if (filters.nurturingProgress.min !== undefined) {
        filtered = filtered.filter(lead => lead.nurturingProgress >= filters.nurturingProgress.min);
      }
      if (filters.nurturingProgress.max !== undefined) {
        filtered = filtered.filter(lead => lead.nurturingProgress <= filters.nurturingProgress.max);
      }
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdDate) <= new Date(filters.dateTo)
      );
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [filters, leads]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleLeadSelect = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    const currentPageLeads = getCurrentPageLeads();
    const allSelected = currentPageLeads.every(lead => selectedLeads.includes(lead._id));
    if (allSelected) {
      setSelectedLeads(prev => prev.filter(id => !currentPageLeads.map(l => l._id).includes(id)));
    } else {
      setSelectedLeads(prev => [...new Set([...prev, ...currentPageLeads.map(l => l._id)])]);
    }
  };

  const handleBulkAction = async (action, leadIds, data) => {
    switch (action) {
      case 'assign':
        // Update assignment in backend
        await Promise.all(leadIds.map(leadId => 
          axios.put(`${API_URL}/${leadId}`, { assignedTo: data.name })
        ));
        refreshLeads();
        break;
      case 'delete':
        // Delete leads in backend
        await Promise.all(leadIds.map(leadId =>
          axios.delete(`${API_URL}/${leadId}`)
        ));
        refreshLeads();
        break;
      default:
        break;
    }
    setSelectedLeads([]);
  };

  const handleLeadAction = (leadId, action) => {
    const lead = leads.find(l => l._id === leadId);
    switch (action) {
      case 'view-profile':
        setSelectedLead(lead);
        setIsProfileModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleUpdateLead = (updatedLead) => {
    axios.put(`${API_URL}/${updatedLead._id}`, updatedLead)
      .then(res => {
        setLeads(prev => prev.map(lead =>
          lead._id === updatedLead._id ? res.data : lead
        ));
        setFilteredLeads(prev => prev.map(lead =>
          lead._id === updatedLead._id ? res.data : lead
        ));
        setSelectedLead(res.data);
      })
      .catch(err => {
        console.error("Failed to update lead:", err);
      });
  };

  const handleImportLeads = () => {
    alert('Lead import functionality would integrate with Housing.com API');
  };

  const handleExportLeads = () => {
    alert('Exporting leads data to CSV/Excel');
  };

  const getCurrentPageLeads = () => {
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    return filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  };

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedLeads([]);
  };

  // Helper to refresh leads from backend
  const refreshLeads = () => {
    axios.get(API_URL)
      .then(res => {
        setLeads(res.data);
        setFilteredLeads(res.data);
      });
  };

  // Get drill-down context for display
  const getDrillDownContext = () => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    switch (filterParam) {
      case 'today-followups':
        return { title: "Today's Follow-ups", description: "Leads requiring follow-up today" };
      case 'overdue-followups':
        return { title: "Overdue Follow-ups", description: "Leads with overdue follow-up actions" };
      case 'engagement':
        return { title: "Highly Engaged Leads", description: "Leads with high WhatsApp engagement activity" };
      default:
        return null;
    }
  };

  const drillDownContext = getDrillDownContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Users" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-text-primary">
                {drillDownContext ? drillDownContext.title : 'Leads Management'}
              </h1>
            </div>
            <p className="text-text-secondary">
              {drillDownContext 
                ? drillDownContext.description 
                : 'Track, qualify, and nurture leads across multiple projects with automated WhatsApp integration'
              }
            </p>
            {/* Drill-down breadcrumb */}
            {drillDownContext && (
              <div className="flex items-center space-x-2 mt-2 text-sm">
                <button 
                  onClick={() => window.history.pushState({}, '', '/leads-management')}
                  className="text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  All Leads
                </button>
                <Icon name="ChevronRight" size={14} className="text-text-muted" />
                <span className="text-text-secondary">{drillDownContext.title}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <LeadFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Action Bar */}
              <LeadActionBar
                selectedLeads={selectedLeads}
                onBulkAction={handleBulkAction}
                onImportLeads={handleImportLeads}
                onExportLeads={handleExportLeads}
              />
              {/* Results Summary */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  Showing {getCurrentPageLeads().length} of {filteredLeads.length} leads
                  {selectedLeads.length > 0 && (
                    <span className="ml-2 text-primary">
                      ({selectedLeads.length} selected)
                    </span>
                  )}
                </div>
                {/* View Toggle for Mobile */}
                {isMobile && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">View:</span>
                    <Button variant="outline" size="sm" iconName="List">
                      Cards
                    </Button>
                  </div>
                )}
              </div>
              {/* Leads Display */}
              {isMobile ? (
                <div className="space-y-4">
                  {getCurrentPageLeads().map((lead) => (
                    <MobileLeadCard
                      key={lead._id}
                      lead={lead}
                      onLeadSelect={handleLeadSelect}
                      onLeadAction={handleLeadAction}
                      isSelected={selectedLeads.includes(lead._id)}
                    />
                  ))}
                </div>
              ) : (
                <LeadTable
                  leads={getCurrentPageLeads()}
                  onLeadSelect={handleLeadSelect}
                  onBulkAction={handleBulkAction}
                  selectedLeads={selectedLeads}
                  onSelectAll={handleSelectAll}
                  onLeadAction={handleLeadAction}
                />
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                    >
                      Previous
                    </Button>
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                              currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Lead Profile Modal */}
      <LeadProfileModal
        lead={selectedLead}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedLead(null);
        }}
        onUpdateLead={handleUpdateLead}
      />
    </div>
  );
};

export default LeadsManagement;
