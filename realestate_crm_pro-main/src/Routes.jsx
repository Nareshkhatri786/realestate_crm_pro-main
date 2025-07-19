import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ProtectedRoute } from "./auth";
// Add your imports here
import Login from "./auth/Login";
import Dashboard from "pages/dashboard";
import SiteVisitsScheduler from "pages/site-visits-scheduler";
import AnalyticsReports from "pages/analytics-reports";
import OpportunitiesManagement from "pages/opportunities-management";
import LeadsManagement from "pages/leads-management";
import LeadDetails from "pages/leads-management/LeadDetails";
import UserManagement from "pages/user-management";
import WhatsAppCampaignManagement from "pages/whats-app-campaign-management";
import SettingsPage from "pages/settings";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/site-visits-scheduler" element={
          <ProtectedRoute>
            <SiteVisitsScheduler />
          </ProtectedRoute>
        } />
        <Route path="/analytics-reports" element={
          <ProtectedRoute>
            <AnalyticsReports />
          </ProtectedRoute>
        } />
        <Route path="/opportunities-management" element={
          <ProtectedRoute>
            <OpportunitiesManagement />
          </ProtectedRoute>
        } />
        <Route path="/leads-management" element={
          <ProtectedRoute>
            <LeadsManagement />
          </ProtectedRoute>
        } />
        <Route path="/leads/:id" element={
          <ProtectedRoute>
            <LeadDetails />
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/whats-app-campaign-management" element={
          <ProtectedRoute>
            <WhatsAppCampaignManagement />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;