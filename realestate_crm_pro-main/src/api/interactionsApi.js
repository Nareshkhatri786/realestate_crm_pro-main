import { apiService } from './apiClient';

// Interaction Logging API
export const interactionsApi = {
  // Log a new interaction
  logInteraction: async (interactionData) => {
    try {
      const interaction = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...interactionData
      };

      // Save to localStorage for now (in real app, would save to backend)
      const savedInteractions = localStorage.getItem('interactions');
      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
      interactions.unshift(interaction);
      
      // Keep only last 10000 interactions
      if (interactions.length > 10000) {
        interactions.splice(10000);
      }
      
      localStorage.setItem('interactions', JSON.stringify(interactions));

      return {
        success: true,
        data: interaction
      };
    } catch (error) {
      console.error('Failed to log interaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get interactions for a contact/lead
  getInteractions: async (filters = {}) => {
    try {
      const savedInteractions = localStorage.getItem('interactions');
      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
      
      let filteredInteractions = [...interactions];

      // Apply filters
      if (filters.contactId) {
        filteredInteractions = filteredInteractions.filter(
          interaction => interaction.contactId === filters.contactId
        );
      }
      
      if (filters.type) {
        filteredInteractions = filteredInteractions.filter(
          interaction => interaction.type === filters.type
        );
      }
      
      if (filters.dateFrom) {
        filteredInteractions = filteredInteractions.filter(
          interaction => new Date(interaction.timestamp) >= new Date(filters.dateFrom)
        );
      }
      
      if (filters.dateTo) {
        filteredInteractions = filteredInteractions.filter(
          interaction => new Date(interaction.timestamp) <= new Date(filters.dateTo)
        );
      }

      // Sort by timestamp (newest first)
      filteredInteractions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        success: true,
        data: filteredInteractions
      };
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update an interaction
  updateInteraction: async (interactionId, updateData) => {
    try {
      const savedInteractions = localStorage.getItem('interactions');
      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
      
      const updatedInteractions = interactions.map(interaction =>
        interaction.id === interactionId
          ? { ...interaction, ...updateData, updatedAt: new Date().toISOString() }
          : interaction
      );
      
      localStorage.setItem('interactions', JSON.stringify(updatedInteractions));

      return {
        success: true,
        data: updatedInteractions.find(i => i.id === interactionId)
      };
    } catch (error) {
      console.error('Failed to update interaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete an interaction
  deleteInteraction: async (interactionId) => {
    try {
      const savedInteractions = localStorage.getItem('interactions');
      const interactions = savedInteractions ? JSON.parse(savedInteractions) : [];
      
      const updatedInteractions = interactions.filter(
        interaction => interaction.id !== interactionId
      );
      
      localStorage.setItem('interactions', JSON.stringify(updatedInteractions));

      return {
        success: true,
        data: { interactionId }
      };
    } catch (error) {
      console.error('Failed to delete interaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get interaction timeline for a contact
  getInteractionTimeline: async (contactId, options = {}) => {
    try {
      const response = await interactionsApi.getInteractions({ contactId });
      if (!response.success) {
        throw new Error(response.error);
      }

      const interactions = response.data;
      const { groupBy = 'day', limit = 100 } = options;

      // Group interactions by time period
      const grouped = {};
      interactions.slice(0, limit).forEach(interaction => {
        const date = new Date(interaction.timestamp);
        let key;
        
        switch (groupBy) {
          case 'hour':
            key = date.toISOString().slice(0, 13);
            break;
          case 'day':
            key = date.toISOString().slice(0, 10);
            break;
          case 'week':
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay());
            key = startOfWeek.toISOString().slice(0, 10);
            break;
          case 'month':
            key = date.toISOString().slice(0, 7);
            break;
          default:
            key = date.toISOString().slice(0, 10);
        }
        
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(interaction);
      });

      return {
        success: true,
        data: {
          timeline: grouped,
          total: interactions.length,
          filtered: Object.values(grouped).flat().length
        }
      };
    } catch (error) {
      console.error('Failed to get interaction timeline:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Calculate engagement score for a contact
  calculateEngagementScore: async (contactId) => {
    try {
      const response = await interactionsApi.getInteractions({ contactId });
      if (!response.success) {
        throw new Error(response.error);
      }

      const interactions = response.data;
      let score = 0;
      const weights = {
        call: { answered: 20, not_answered: 5, busy: 2, switched_off: 1 },
        whatsapp: { sent: 5, delivered: 8, read: 12, replied: 25 },
        email: { sent: 3, opened: 8, clicked: 15, replied: 20 },
        meeting: { scheduled: 15, attended: 30, no_show: -5 },
        site_visit: { scheduled: 20, attended: 40, no_show: -10 },
        manual_note: 5,
        form_submission: 15,
        website_visit: 2,
        document_download: 8
      };

      // Calculate score based on interaction types and outcomes
      interactions.forEach(interaction => {
        const typeWeight = weights[interaction.type];
        if (typeWeight) {
          if (typeof typeWeight === 'object') {
            score += typeWeight[interaction.outcome] || 0;
          } else {
            score += typeWeight;
          }
        }
      });

      // Apply recency multiplier (more recent interactions have higher weight)
      const now = new Date();
      interactions.forEach(interaction => {
        const daysSince = (now - new Date(interaction.timestamp)) / (1000 * 60 * 60 * 24);
        const recencyMultiplier = Math.max(0.1, 1 - (daysSince / 365)); // Decay over a year
        
        const typeWeight = weights[interaction.type];
        if (typeWeight) {
          if (typeof typeWeight === 'object') {
            score += (typeWeight[interaction.outcome] || 0) * recencyMultiplier * 0.5;
          } else {
            score += typeWeight * recencyMultiplier * 0.5;
          }
        }
      });

      // Calculate engagement level
      let level = 'Low';
      if (score >= 200) level = 'Very High';
      else if (score >= 100) level = 'High';
      else if (score >= 50) level = 'Medium';

      return {
        success: true,
        data: {
          score: Math.round(score),
          level,
          totalInteractions: interactions.length,
          lastInteraction: interactions[0]?.timestamp,
          breakdown: {
            calls: interactions.filter(i => i.type === 'call').length,
            whatsapp: interactions.filter(i => i.type === 'whatsapp').length,
            emails: interactions.filter(i => i.type === 'email').length,
            meetings: interactions.filter(i => i.type === 'meeting').length,
            siteVisits: interactions.filter(i => i.type === 'site_visit').length
          }
        }
      };
    } catch (error) {
      console.error('Failed to calculate engagement score:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get interaction analytics
  getInteractionAnalytics: async (filters = {}) => {
    try {
      const response = await interactionsApi.getInteractions(filters);
      if (!response.success) {
        throw new Error(response.error);
      }

      const interactions = response.data;
      
      const analytics = {
        total: interactions.length,
        byType: {},
        byOutcome: {},
        byDay: {},
        byHour: {},
        trends: {
          daily: {},
          weekly: {},
          monthly: {}
        },
        averageResponseTime: 0,
        mostActiveHours: [],
        topPerformingTypes: []
      };

      // Count by type and outcome
      interactions.forEach(interaction => {
        // By type
        analytics.byType[interaction.type] = (analytics.byType[interaction.type] || 0) + 1;
        
        // By outcome
        if (interaction.outcome) {
          analytics.byOutcome[interaction.outcome] = (analytics.byOutcome[interaction.outcome] || 0) + 1;
        }
        
        // By day
        const day = new Date(interaction.timestamp).toDateString();
        analytics.byDay[day] = (analytics.byDay[day] || 0) + 1;
        
        // By hour
        const hour = new Date(interaction.timestamp).getHours();
        analytics.byHour[hour] = (analytics.byHour[hour] || 0) + 1;
      });

      // Calculate trends
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      
      interactions.forEach(interaction => {
        const date = new Date(interaction.timestamp);
        if (date >= thirtyDaysAgo) {
          const dayKey = date.toISOString().slice(0, 10);
          const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
          const monthKey = date.toISOString().slice(0, 7);
          
          analytics.trends.daily[dayKey] = (analytics.trends.daily[dayKey] || 0) + 1;
          analytics.trends.weekly[weekKey] = (analytics.trends.weekly[weekKey] || 0) + 1;
          analytics.trends.monthly[monthKey] = (analytics.trends.monthly[monthKey] || 0) + 1;
        }
      });

      // Find most active hours
      analytics.mostActiveHours = Object.entries(analytics.byHour)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }));

      // Top performing types
      analytics.topPerformingTypes = Object.entries(analytics.byType)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count }));

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Failed to get interaction analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Export interaction data
  exportInteractions: async (contactId, format = 'json') => {
    try {
      const response = await interactionsApi.getInteractions({ contactId });
      if (!response.success) {
        throw new Error(response.error);
      }

      const interactions = response.data;
      let exportData;
      let filename;
      let mimeType;

      switch (format) {
        case 'csv':
          const csvHeaders = ['Date', 'Type', 'Outcome', 'Notes', 'Duration'];
          const csvRows = interactions.map(interaction => [
            new Date(interaction.timestamp).toLocaleString(),
            interaction.type,
            interaction.outcome || '',
            interaction.notes || '',
            interaction.duration || ''
          ]);
          
          exportData = [csvHeaders, ...csvRows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
          
          filename = `interactions_${contactId}_${new Date().toISOString().slice(0, 10)}.csv`;
          mimeType = 'text/csv';
          break;
          
        case 'json':
        default:
          exportData = JSON.stringify(interactions, null, 2);
          filename = `interactions_${contactId}_${new Date().toISOString().slice(0, 10)}.json`;
          mimeType = 'application/json';
          break;
      }

      // Create and trigger download
      const blob = new Blob([exportData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        data: { filename, recordCount: interactions.length }
      };
    } catch (error) {
      console.error('Failed to export interactions:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get interaction types and their configurations
  getInteractionTypes: () => {
    return [
      {
        type: 'call',
        label: 'Phone Call',
        icon: 'Phone',
        color: 'blue',
        outcomes: ['answered', 'not_answered', 'busy', 'switched_off', 'invalid_number'],
        tracksDuration: true,
        requiresNotes: false
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp Message',
        icon: 'MessageCircle',
        color: 'green',
        outcomes: ['sent', 'delivered', 'read', 'replied'],
        tracksDuration: false,
        requiresNotes: false
      },
      {
        type: 'email',
        label: 'Email',
        icon: 'Mail',
        color: 'purple',
        outcomes: ['sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced'],
        tracksDuration: false,
        requiresNotes: false
      },
      {
        type: 'meeting',
        label: 'Meeting',
        icon: 'Calendar',
        color: 'orange',
        outcomes: ['scheduled', 'attended', 'no_show', 'rescheduled', 'cancelled'],
        tracksDuration: true,
        requiresNotes: true
      },
      {
        type: 'site_visit',
        label: 'Site Visit',
        icon: 'MapPin',
        color: 'red',
        outcomes: ['scheduled', 'attended', 'no_show', 'rescheduled', 'cancelled'],
        tracksDuration: true,
        requiresNotes: true
      },
      {
        type: 'manual_note',
        label: 'Manual Note',
        icon: 'FileText',
        color: 'gray',
        outcomes: ['created', 'updated'],
        tracksDuration: false,
        requiresNotes: true
      },
      {
        type: 'form_submission',
        label: 'Form Submission',
        icon: 'FormInput',
        color: 'indigo',
        outcomes: ['submitted', 'incomplete', 'validated'],
        tracksDuration: false,
        requiresNotes: false
      },
      {
        type: 'website_visit',
        label: 'Website Visit',
        icon: 'Globe',
        color: 'cyan',
        outcomes: ['page_view', 'session_start', 'session_end'],
        tracksDuration: true,
        requiresNotes: false
      },
      {
        type: 'document_download',
        label: 'Document Download',
        icon: 'Download',
        color: 'emerald',
        outcomes: ['downloaded', 'viewed', 'shared'],
        tracksDuration: false,
        requiresNotes: false
      }
    ];
  },

  // Auto-log system interactions
  autoLogInteraction: async (type, contactId, data = {}) => {
    const interactionTypes = interactionsApi.getInteractionTypes();
    const typeConfig = interactionTypes.find(t => t.type === type);
    
    if (!typeConfig) {
      console.warn(`Unknown interaction type: ${type}`);
      return { success: false, error: 'Unknown interaction type' };
    }

    const interaction = {
      type,
      contactId,
      outcome: data.outcome || typeConfig.outcomes[0],
      duration: data.duration,
      notes: data.notes || '',
      metadata: data.metadata || {},
      source: 'system'
    };

    return await interactionsApi.logInteraction(interaction);
  }
};

export default interactionsApi;