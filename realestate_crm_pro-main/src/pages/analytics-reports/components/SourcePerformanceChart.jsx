import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SourcePerformanceChart = ({ title = "Lead Source Performance" }) => {
  const chartData = [
    { source: 'Housing.com', leads: 245, qualified: 180, converted: 45, conversionRate: 18.4 },
    { source: 'WhatsApp Referral', leads: 189, qualified: 142, converted: 38, conversionRate: 20.1 },
    { source: 'Website Form', leads: 156, qualified: 98, converted: 22, conversionRate: 14.1 },
    { source: 'Walk-in', leads: 134, qualified: 89, converted: 28, conversionRate: 20.9 },
    { source: 'Social Media', leads: 98, qualified: 65, converted: 15, conversionRate: 15.3 },
    { source: 'Print Ads', leads: 76, qualified: 42, converted: 8, conversionRate: 10.5 },
    { source: 'Broker Network', leads: 67, qualified: 48, converted: 18, conversionRate: 26.9 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium text-text-primary mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Total Leads:</span>
              <span className="text-sm font-medium text-text-primary">{data.leads}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Qualified:</span>
              <span className="text-sm font-medium text-accent-600">{data.qualified}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Converted:</span>
              <span className="text-sm font-medium text-success-600">{data.converted}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm text-text-secondary">Conversion Rate:</span>
              <span className="text-sm font-bold text-primary">{data.conversionRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">Performance comparison across different lead sources</p>
      </div>
      <div className="card-content">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="source" 
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
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar 
                dataKey="leads" 
                fill="var(--color-primary-200)" 
                name="Total Leads"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="qualified" 
                fill="var(--color-accent)" 
                name="Qualified Leads"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="converted" 
                fill="var(--color-success)" 
                name="Converted"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SourcePerformanceChart;