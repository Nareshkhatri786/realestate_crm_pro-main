import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Icon from '../../../components/AppIcon';

const WhatsAppAnalytics = ({ title = "WhatsApp Campaign Analytics" }) => {
  const deliveryData = [
    { name: 'Delivered', value: 2847, color: '#10B981' },
    { name: 'Read', value: 2156, color: '#3B82F6' },
    { name: 'Replied', value: 892, color: '#F59E0B' },
    { name: 'Failed', value: 156, color: '#EF4444' }
  ];

  const campaignData = [
    { campaign: 'Week 1 Welcome', sent: 456, delivered: 442, read: 398, replied: 156, responseRate: 35.2 },
    { campaign: 'Week 2 Follow-up', sent: 398, delivered: 387, read: 342, replied: 98, responseRate: 28.7 },
    { campaign: 'Site Visit Reminder', sent: 234, delivered: 228, read: 201, replied: 89, responseRate: 44.3 },
    { campaign: 'Price Update', sent: 567, delivered: 551, read: 478, replied: 134, responseRate: 28.0 },
    { campaign: 'Festival Offer', sent: 789, delivered: 765, read: 689, replied: 267, responseRate: 38.8 },
    { campaign: 'Monthly Newsletter', sent: 1234, delivered: 1198, read: 987, replied: 198, responseRate: 20.1 }
  ];

  const messageTypes = [
    { type: 'Welcome Messages', count: 456, engagement: 85.2, icon: 'MessageCircle' },
    { type: 'Follow-up Messages', count: 892, engagement: 72.4, icon: 'Clock' },
    { type: 'Site Visit Reminders', count: 234, engagement: 91.7, icon: 'MapPin' },
    { type: 'Price Updates', count: 567, engagement: 68.9, icon: 'TrendingUp' },
    { type: 'Promotional Offers', count: 789, engagement: 76.3, icon: 'Tag' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.payload.color }}>
            {data.value.toLocaleString()}
          </p>
          <p className="text-xs text-text-secondary">
            {((data.value / deliveryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mt-1">WhatsApp message delivery and engagement metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Delivery Overview */}
        <div className="card">
          <div className="card-header">
            <h4 className="text-md font-semibold text-text-primary">Message Delivery Overview</h4>
          </div>
          <div className="card-content">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deliveryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold text-success-600">94.8%</p>
                <p className="text-sm text-text-secondary">Delivery Rate</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">31.3%</p>
                <p className="text-sm text-text-secondary">Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Types Performance */}
        <div className="card">
          <div className="card-header">
            <h4 className="text-md font-semibold text-text-primary">Message Types Performance</h4>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {messageTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-background-secondary rounded-lg">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon name={type.icon} size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-text-primary">{type.type}</h5>
                      <span className="text-sm font-medium text-text-primary">{type.count}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${type.engagement}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary">{type.engagement}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="card">
        <div className="card-header">
          <h4 className="text-md font-semibold text-text-primary">Campaign Performance</h4>
          <p className="text-sm text-text-secondary mt-1">Detailed breakdown of individual campaign metrics</p>
        </div>
        <div className="card-content">
          <div className="w-full h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="campaign" 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="sent" fill="var(--color-secondary-400)" name="Sent" radius={[2, 2, 0, 0]} />
                <Bar dataKey="delivered" fill="var(--color-primary)" name="Delivered" radius={[2, 2, 0, 0]} />
                <Bar dataKey="read" fill="var(--color-accent)" name="Read" radius={[2, 2, 0, 0]} />
                <Bar dataKey="replied" fill="var(--color-success)" name="Replied" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Campaign Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Campaign</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Sent</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Delivered</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Read</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Replied</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary">Response Rate</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, index) => (
                  <tr key={index} className="border-b border-border hover:bg-background-secondary">
                    <td className="py-3 px-4 font-medium text-text-primary">{campaign.campaign}</td>
                    <td className="text-center py-3 px-4 text-text-primary">{campaign.sent}</td>
                    <td className="text-center py-3 px-4 text-text-primary">{campaign.delivered}</td>
                    <td className="text-center py-3 px-4 text-text-primary">{campaign.read}</td>
                    <td className="text-center py-3 px-4 text-success-600 font-medium">{campaign.replied}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.responseRate >= 35 ? 'bg-success-100 text-success-700' :
                        campaign.responseRate >= 25 ? 'bg-warning-100 text-warning-700': 'bg-error-100 text-error-700'
                      }`}>
                        {campaign.responseRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppAnalytics;