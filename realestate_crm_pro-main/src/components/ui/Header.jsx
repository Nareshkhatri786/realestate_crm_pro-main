import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('Skyline Residences');

  const projectDropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Leads', path: '/leads-management', icon: 'Users' },
  { label: 'Opportunities', path: '/opportunities-management', icon: 'Target' },
  { label: 'Site Visits', path: '/site-visits-scheduler', icon: 'Calendar' },
  { label: 'Analytics', path: '/analytics-reports', icon: 'BarChart3' },
  { label: 'User Management', path: '/user-management', icon: 'UserCog' },
  { label: 'WhatsApp Campaigns', path: '/whats-app-campaign-management', icon: 'MessageCircle' }];


  const projects = [
  { id: 1, name: 'Skyline Residences', status: 'Active', units: 120 },
  { id: 2, name: 'Marina Heights', status: 'Active', units: 85 },
  { id: 3, name: 'Garden View Apartments', status: 'Planning', units: 200 },
  { id: 4, name: 'Downtown Plaza', status: 'Completed', units: 150 }];


  const notifications = [
  { id: 1, type: 'follow-up', message: 'Follow up with John Smith required', time: '5 min ago', urgent: true },
  { id: 2, type: 'site-visit', message: 'Site visit scheduled for tomorrow 2 PM', time: '1 hour ago', urgent: false },
  { id: 3, type: 'lead', message: 'New lead assigned: Sarah Johnson', time: '2 hours ago', urgent: false },
  { id: 4, type: 'opportunity', message: 'Opportunity moved to negotiation stage', time: '3 hours ago', urgent: false }];


  const urgentNotifications = notifications.filter((n) => n.urgent).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleProjectChange = (project) => {
    setSelectedProject(project.name);
    setIsProjectDropdownOpen(false);
  };

  const handleLogout = () => {
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow-up':return 'Clock';
      case 'site-visit':return 'MapPin';
      case 'lead':return 'UserPlus';
      case 'opportunity':return 'TrendingUp';
      default:return 'Bell';
    }
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-foreground" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-text-primary font-heading">Signature Properties</h1>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors duration-200">

            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) =>
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`nav-tab ${location.pathname === item.path ? 'active' : ''}`}>

              <Icon name={item.icon} size={16} className="mr-2" />
              {item.label}
            </button>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Project Selector */}
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-text-primary bg-background-secondary rounded-md hover:bg-secondary-200 transition-colors duration-200">

              <Icon name="Building2" size={16} />
              <span className="max-w-32 truncate">{selectedProject}</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {isProjectDropdownOpen &&
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-md shadow-lg z-60">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Select Project
                  </div>
                  {projects.map((project) =>
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-background-secondary rounded-md transition-colors duration-200">

                      <div className="flex flex-col items-start">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-xs text-text-secondary">{project.units} units</span>
                      </div>
                      <span className={`status-badge ${project.status === 'Active' ? 'success' : project.status === 'Planning' ? 'warning' : 'text-text-secondary bg-secondary-100'}`}>
                        {project.status}
                      </span>
                    </button>
                )}
                </div>
              </div>
            }
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-md transition-colors duration-200">

              <Icon name="Bell" size={20} />
              {urgentNotifications > 0 &&
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {urgentNotifications}
                </span>
              }
            </button>

            {isNotificationOpen &&
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-md shadow-lg z-60">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((notification) =>
                  <div
                    key={notification.id}
                    className={`p-3 rounded-md border transition-colors duration-200 hover:bg-background-secondary cursor-pointer ${
                    notification.urgent ? 'border-error-200 bg-error-50' : 'border-border'}`
                    }>

                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${notification.urgent ? 'bg-error-100' : 'bg-secondary-100'}`}>
                            <Icon
                          name={getNotificationIcon(notification.type)}
                          size={14}
                          className={notification.urgent ? 'text-error-600' : 'text-secondary-600'} />

                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary">{notification.message}</p>
                            <p className="text-xs text-text-secondary mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            }
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-md transition-colors duration-200">

              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">JD</span>
              </div>
              <Icon name="ChevronDown" size={14} className="hidden sm:block" />
            </button>

            {isUserMenuOpen &&
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg z-60">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">John Doe</p>
                    <p className="text-xs text-text-secondary">Sales Executive</p>
                  </div>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary rounded-md transition-colors duration-200">
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background-secondary rounded-md transition-colors duration-200">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error-50 rounded-md transition-colors duration-200">

                    <Icon name="LogOut" size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen &&
      <div className="lg:hidden border-t border-border bg-surface">
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) =>
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            location.pathname === item.path ?
            'text-primary bg-primary-50' : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'}`
            }>

                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
          )}
            
            {/* Mobile Project Selector */}
            <div className="pt-2 mt-2 border-t border-border">
              <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-text-primary bg-background-secondary rounded-md">

                <div className="flex items-center space-x-2">
                  <Icon name="Building2" size={16} />
                  <span>{selectedProject}</span>
                </div>
                <Icon name="ChevronDown" size={14} />
              </button>
            </div>
          </div>
        </div>
      }
    </header>);

};

export default Header;