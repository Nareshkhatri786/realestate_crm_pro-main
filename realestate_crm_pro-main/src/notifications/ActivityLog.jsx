import React, { useState, useEffect } from 'react';

// Mock activity data - TODO: Replace with real API in future PRs
const mockActivities = [
  {
    id: 1,
    type: 'user_login',
    message: 'John Doe logged in',
    timestamp: new Date(Date.now() - 300000),
    user: 'John Doe',
    metadata: { ip: '192.168.1.1' }
  },
  {
    id: 2,
    type: 'lead_created',
    message: 'New lead created: Sarah Smith',
    timestamp: new Date(Date.now() - 600000),
    user: 'Priya Sharma',
    metadata: { leadId: 123, phone: '+91-9876543210' }
  },
  {
    id: 3,
    type: 'opportunity_updated',
    message: 'Opportunity "Marina Heights Unit 4B" updated',
    timestamp: new Date(Date.now() - 900000),
    user: 'Amit Patel',
    metadata: { opportunityId: 456, status: 'negotiation' }
  },
  {
    id: 4,
    type: 'user_created',
    message: 'New user account created: Michael Johnson',
    timestamp: new Date(Date.now() - 1200000),
    user: 'Admin',
    metadata: { userId: 789, role: 'sales_agent' }
  },
  {
    id: 5,
    type: 'campaign_sent',
    message: 'WhatsApp campaign "Property Launch" sent to 50 contacts',
    timestamp: new Date(Date.now() - 1800000),
    user: 'Priya Sharma',
    metadata: { campaignId: 101, recipients: 50 }
  }
];

const ActivityLog = ({ maxItems = 10, showFilters = true }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchActivities = () => {
      setLoading(true);
      setTimeout(() => {
        setActivities(mockActivities);
        setLoading(false);
      }, 1000);
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_login':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'lead_created':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'opportunity_updated':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'user_created':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'campaign_sent':
        return (
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const filteredActivities = activities
    .filter(activity => filter === 'all' || activity.type === filter)
    .slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Activity Log</h3>
        {showFilters && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Activities</option>
            <option value="user_login">User Logins</option>
            <option value="lead_created">Leads</option>
            <option value="opportunity_updated">Opportunities</option>
            <option value="user_created">Users</option>
            <option value="campaign_sent">Campaigns</option>
          </select>
        )}
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No activities found</p>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">by {activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View all activities →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;