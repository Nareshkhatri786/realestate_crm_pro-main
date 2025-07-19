import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import Dashboard from "pages/dashboard";
import SiteVisitsScheduler from "pages/site-visits-scheduler";
import AnalyticsReports from "pages/analytics-reports";
import OpportunitiesManagement from "pages/opportunities-management";
import LeadsManagement from "pages/leads-management";
import UserManagement from "pages/user-management";
import WhatsAppCampaignManagement from "pages/whats-app-campaign-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/site-visits-scheduler" element={<SiteVisitsScheduler />} />
        <Route path="/analytics-reports" element={<AnalyticsReports />} />
        <Route path="/opportunities-management" element={<OpportunitiesManagement />} />
        <Route path="/leads-management" element={<LeadsManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/whats-app-campaign-management" element={<WhatsAppCampaignManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;