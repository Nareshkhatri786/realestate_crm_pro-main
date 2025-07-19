import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TeamLeaderboard = ({ title = "Team Performance Leaderboard" }) => {
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState('desc');

  const teamData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      role: 'Sales Executive',
      calls: 234,
      visits: 45,
      opportunities: 28,
      bookings: 12,
      revenue: 2850000,
      conversionRate: 26.7,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Sales Executive',
      calls: 198,
      visits: 38,
      opportunities: 22,
      bookings: 9,
      revenue: 2145000,
      conversionRate: 23.7,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'Telecaller',
      calls: 312,
      visits: 52,
      opportunities: 31,
      bookings: 8,
      revenue: 1920000,
      conversionRate: 25.8,
      trend: 'up'
    },
    {
      id: 4,
      name: 'Alex Brown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'Sales Executive',
      calls: 176,
      visits: 29,
      opportunities: 18,
      bookings: 7,
      revenue: 1680000,
      conversionRate: 24.1,
      trend: 'down'
    },
    {
      id: 5,
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'Telecaller',
      calls: 267,
      visits: 41,
      opportunities: 19,
      bookings: 6,
      revenue: 1440000,
      conversionRate: 22.0,
      trend: 'stable'
    },
    {
      id: 6,
      name: 'Lisa Chen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      role: 'Telecaller',
      calls: 189,
      visits: 33,
      opportunities: 15,
      bookings: 5,
      revenue: 1200000,
      conversionRate: 20.3,
      trend: 'up'
    }
  ];

  const sortedData = [...teamData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'desc') {
      return bValue - aValue;
    }
    return aValue - bValue;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return { icon: 'TrendingUp', color: 'text-success-600' };
      case 'down': return { icon: 'TrendingDown', color: 'text-error-600' };
      default: return { icon: 'Minus', color: 'text-text-secondary' };
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return 'bg-yellow-500 text-white';
    if (index === 1) return 'bg-gray-400 text-white';
    if (index === 2) return 'bg-amber-600 text-white';
    return 'bg-secondary-200 text-text-secondary';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary mt-1">Team performance rankings and metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="bookings">Sort by Bookings</option>
              <option value="conversionRate">Sort by Conversion Rate</option>
              <option value="calls">Sort by Calls</option>
              <option value="visits">Sort by Visits</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          {sortedData.map((member, index) => {
            const trendInfo = getTrendIcon(member.trend);
            
            return (
              <div key={member.id} className="flex items-center space-x-4 p-4 bg-background-secondary rounded-lg hover:bg-secondary-100 transition-colors duration-200">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(index)}`}>
                  {index + 1}
                </div>
                
                {/* Avatar and Info */}
                <div className="flex items-center space-x-3 flex-1">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">{member.name}</h4>
                    <p className="text-xs text-text-secondary">{member.role}</p>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-text-primary">{member.calls}</p>
                    <p className="text-xs text-text-secondary">Calls</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-text-primary">{member.visits}</p>
                    <p className="text-xs text-text-secondary">Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-text-primary">{member.opportunities}</p>
                    <p className="text-xs text-text-secondary">Opportunities</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-success-600">{member.bookings}</p>
                    <p className="text-xs text-text-secondary">Bookings</p>
                  </div>
                </div>
                
                {/* Revenue and Conversion */}
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatCurrency(member.revenue)}</p>
                  <div className="flex items-center space-x-1 justify-end">
                    <span className="text-sm text-text-secondary">{member.conversionRate}%</span>
                    <Icon name={trendInfo.icon} size={14} className={trendInfo.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-text-primary">1,376</p>
              <p className="text-sm text-text-secondary">Total Calls</p>
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">238</p>
              <p className="text-sm text-text-secondary">Total Visits</p>
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">133</p>
              <p className="text-sm text-text-secondary">Total Opportunities</p>
            </div>
            <div>
              <p className="text-xl font-bold text-success-600">47</p>
              <p className="text-sm text-text-secondary">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderboard;