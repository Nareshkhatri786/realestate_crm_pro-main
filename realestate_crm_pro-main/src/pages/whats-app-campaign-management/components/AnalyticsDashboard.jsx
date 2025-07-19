import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsDashboard = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('delivery');

  const periods = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const metrics = [
    { value: 'delivery', label: 'Delivery Rate' },
    { value: 'read', label: 'Read Rate' },
    { value: 'reply', label: 'Reply Rate' },
    { value: 'conversion', label: 'Conversion Rate' }
  ];

  const performanceData = [
    { name: 'Mon', delivered: 245, read: 189, replied: 34, failed: 12 },
    { name: 'Tue', delivered: 312, read: 267, replied: 45, failed: 8 },
    { name: 'Wed', delivered: 289, read: 234, replied: 38, failed: 15 },
    { name: 'Thu', delivered: 356, read: 298, replied: 52, failed: 6 },
    { name: 'Fri', delivered: 401, read: 345, replied: 61, failed: 9 },
    { name: 'Sat', delivered: 298, read: 234, replied: 41, failed: 11 },
    { name: 'Sun', delivered: 267, read: 201, replied: 35, failed: 13 }
  ];

  const campaignPerformance = [
    { name: 'Welcome Series', sent: 1245, delivered: 1189, read: 967, replied: 234, conversion: 45 },
    { name: 'Property Updates', sent: 892, delivered: 845, read: 623, replied: 156, conversion: 32 },
    { name: 'Site Visit Reminders', sent: 567, delivered: 534, read: 445, replied: 89, conversion: 67 },
    { name: 'Follow-up Messages', sent: 423, delivered: 398, read: 298, replied: 78, conversion: 23 },
    { name: 'Booking Confirmations', sent: 234, delivered: 221, read: 189, replied: 45, conversion: 34 }
  ];

  const audienceSegments = [
    { name: 'Hot Leads', value: 423, color: '#DC2626' },
    { name: 'Warm Leads', value: 356, color: '#F59E0B' },
    { name: 'Cold Leads', value: 234, color: '#3B82F6' },
    { name: 'Nurturing', value: 189, color: '#10B981' },
    { name: 'Qualified', value: 145, color: '#8B5CF6' }
  ];

  const optimalTiming = [
    { hour: '9 AM', rate: 85 },
    { hour: '10 AM', rate: 92 },
    { hour: '11 AM', rate: 88 },
    { hour: '12 PM', rate: 76 },
    { hour: '1 PM', rate: 68 },
    { hour: '2 PM', rate: 82 },
    { hour: '3 PM', rate: 89 },
    { hour: '4 PM', rate: 91 },
    { hour: '5 PM', rate: 87 },
    { hour: '6 PM', rate: 79 }
  ];

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'delivery': return '#10B981';
      case 'read': return '#3B82F6';
      case 'reply': return '#F59E0B';
      case 'conversion': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const calculateRate = (numerator, denominator) => {
    return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
  };

  const totalMetrics = performanceData.reduce((acc, day) => ({
    delivered: acc.delivered + day.delivered,
    read: acc.read + day.read,
    replied: acc.replied + day.replied,
    failed: acc.failed + day.failed
  }), { delivered: 0, read: 0, replied: 0, failed: 0 });

  const totalSent = totalMetrics.delivered + totalMetrics.failed;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Analytics Dashboard</h2>
          <p className="text-text-secondary">Track your WhatsApp campaign performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            iconName="Download"
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-radius-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Messages Sent</p>
              <p className="text-2xl font-bold text-text-primary">{totalSent.toLocaleString()}</p>
              <p className="text-xs text-success mt-1">+12% from last week</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Send" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-radius-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Delivery Rate</p>
              <p className="text-2xl font-bold text-text-primary">{calculateRate(totalMetrics.delivered, totalSent)}%</p>
              <p className="text-xs text-success mt-1">+3% from last week</p>
            </div>
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-radius-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Read Rate</p>
              <p className="text-2xl font-bold text-text-primary">{calculateRate(totalMetrics.read, totalMetrics.delivered)}%</p>
              <p className="text-xs text-warning mt-1">-2% from last week</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-radius-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Reply Rate</p>
              <p className="text-2xl font-bold text-text-primary">{calculateRate(totalMetrics.replied, totalMetrics.read)}%</p>
              <p className="text-xs text-success mt-1">+5% from last week</p>
            </div>
            <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
              <Icon name="MessageCircle" size={20} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Performance Trends</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-border rounded-radius text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric === 'delivery' ? 'delivered' : selectedMetric === 'read' ? 'read' : 'replied'}
                stroke={getMetricColor(selectedMetric)}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Performance & Audience Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="bg-surface border border-border rounded-radius-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Campaign Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivered" fill="#10B981" />
                <Bar dataKey="read" fill="#3B82F6" />
                <Bar dataKey="replied" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Segments */}
        <div className="bg-surface border border-border rounded-radius-md p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Audience Segments</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audienceSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {audienceSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Optimal Timing Analysis */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Optimal Timing Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={optimalTiming}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-surface border border-border rounded-radius-md p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-success-50 border border-success-200 rounded-radius-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-success-700">Best Performing Campaign</h4>
                <p className="text-sm text-success-600 mt-1">
                  "Site Visit Reminders" has the highest conversion rate at 12.5%. Consider using similar messaging for other campaigns.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-warning-50 border border-warning-200 rounded-radius-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning-700">Optimal Send Time</h4>
                <p className="text-sm text-warning-600 mt-1">
                  Messages sent between 10 AM - 4 PM have 15% higher read rates. Schedule campaigns during this window.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary-50 border border-primary-200 rounded-radius-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Users" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-700">Audience Engagement</h4>
                <p className="text-sm text-primary-600 mt-1">
                  Hot leads have 3x higher reply rates. Create targeted campaigns for this segment to maximize engagement.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-error-50 border border-error-200 rounded-radius-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
              <div>
                <h4 className="font-medium text-error-700">Delivery Issues</h4>
                <p className="text-sm text-error-600 mt-1">
                  5% delivery failure rate detected. Review phone number quality and consider list cleaning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;