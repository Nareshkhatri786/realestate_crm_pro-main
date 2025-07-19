import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LeadTrendsChart = ({ data, title = "Lead Generation Trends" }) => {
  const chartData = [
    { date: '01 Jan', leads: 45, qualified: 32, converted: 8 },
    { date: '02 Jan', leads: 52, qualified: 38, converted: 12 },
    { date: '03 Jan', leads: 48, qualified: 35, converted: 9 },
    { date: '04 Jan', leads: 61, qualified: 42, converted: 15 },
    { date: '05 Jan', leads: 55, qualified: 39, converted: 11 },
    { date: '06 Jan', leads: 67, qualified: 48, converted: 18 },
    { date: '07 Jan', leads: 59, qualified: 41, converted: 13 },
    { date: '08 Jan', leads: 73, qualified: 52, converted: 21 },
    { date: '09 Jan', leads: 68, qualified: 47, converted: 16 },
    { date: '10 Jan', leads: 71, qualified: 49, converted: 19 },
    { date: '11 Jan', leads: 64, qualified: 44, converted: 14 },
    { date: '12 Jan', leads: 78, qualified: 56, converted: 23 },
    { date: '13 Jan', leads: 82, qualified: 61, converted: 25 },
    { date: '14 Jan', leads: 75, qualified: 53, converted: 20 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-text-secondary">{entry.name}:</span>
              <span className="font-medium text-text-primary">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">Daily lead generation and conversion trends</p>
      </div>
      <div className="card-content">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
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
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Total Leads"
              />
              <Line 
                type="monotone" 
                dataKey="qualified" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
                name="Qualified Leads"
              />
              <Line 
                type="monotone" 
                dataKey="converted" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-success)', strokeWidth: 2 }}
                name="Converted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeadTrendsChart;