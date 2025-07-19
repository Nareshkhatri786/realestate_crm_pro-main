import { apiService } from './apiClient';

// Call Tracking API
export const callsApi = {
  // Initiate a call
  initiateCall: async (callData) => {
    try {
      // In a real implementation, this would integrate with a telephony service
      const response = await apiService.post('/api/calls/initiate', callData);
      
      // For now, simulate call initiation
      const simulatedResponse = {
        success: true,
        data: {
          callId: Date.now().toString(),
          status: 'initiated',
          phoneNumber: callData.phoneNumber,
          contactId: callData.contactId,
          startTime: new Date().toISOString(),
          dialerAction: 'tel:' + callData.phoneNumber // This will open the device dialer
        }
      };
      
      return simulatedResponse;
    } catch (error) {
      console.error('Failed to initiate call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update call status
  updateCallStatus: async (callId, statusData) => {
    try {
      const response = await apiService.put(`/api/calls/${callId}/status`, statusData);
      
      // Simulate API response
      return {
        success: true,
        data: {
          callId,
          ...statusData,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Failed to update call status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get call history
  getCallHistory: async (filters = {}) => {
    try {
      // For now, return mock data from localStorage
      const savedCalls = localStorage.getItem('call_history');
      const calls = savedCalls ? JSON.parse(savedCalls) : [];
      
      let filteredCalls = [...calls];

      // Apply filters
      if (filters.contactId) {
        filteredCalls = filteredCalls.filter(call => call.contactId === filters.contactId);
      }
      
      if (filters.status) {
        filteredCalls = filteredCalls.filter(call => call.status === filters.status);
      }
      
      if (filters.dateFrom) {
        filteredCalls = filteredCalls.filter(call => 
          new Date(call.startTime) >= new Date(filters.dateFrom)
        );
      }
      
      if (filters.dateTo) {
        filteredCalls = filteredCalls.filter(call => 
          new Date(call.startTime) <= new Date(filters.dateTo)
        );
      }

      // Sort by start time (newest first)
      filteredCalls.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      return {
        success: true,
        data: filteredCalls
      };
    } catch (error) {
      console.error('Failed to fetch call history:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Log a call
  logCall: async (callData) => {
    try {
      const call = {
        id: Date.now().toString(),
        ...callData,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, would save to backend)
      const savedCalls = localStorage.getItem('call_history');
      const calls = savedCalls ? JSON.parse(savedCalls) : [];
      calls.unshift(call);
      
      // Keep only last 1000 calls
      if (calls.length > 1000) {
        calls.splice(1000);
      }
      
      localStorage.setItem('call_history', JSON.stringify(calls));

      return {
        success: true,
        data: call
      };
    } catch (error) {
      console.error('Failed to log call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete call log
  deleteCall: async (callId) => {
    try {
      const savedCalls = localStorage.getItem('call_history');
      const calls = savedCalls ? JSON.parse(savedCalls) : [];
      const updatedCalls = calls.filter(call => call.id !== callId);
      
      localStorage.setItem('call_history', JSON.stringify(updatedCalls));

      return {
        success: true,
        data: { callId }
      };
    } catch (error) {
      console.error('Failed to delete call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get call analytics
  getCallAnalytics: async (filters = {}) => {
    try {
      const historyResponse = await callsApi.getCallHistory(filters);
      if (!historyResponse.success) {
        throw new Error(historyResponse.error);
      }

      const calls = historyResponse.data;
      
      const analytics = {
        totalCalls: calls.length,
        answeredCalls: calls.filter(c => c.status === 'answered').length,
        notAnsweredCalls: calls.filter(c => c.status === 'not_answered').length,
        busyCalls: calls.filter(c => c.status === 'busy').length,
        switchedOffCalls: calls.filter(c => c.status === 'switched_off').length,
        averageDuration: 0,
        totalDuration: 0,
        callsByDay: {},
        callsByHour: {},
        statusDistribution: {}
      };

      // Calculate average duration
      const answeredCalls = calls.filter(c => c.status === 'answered' && c.duration);
      if (answeredCalls.length > 0) {
        analytics.totalDuration = answeredCalls.reduce((sum, call) => sum + (call.duration || 0), 0);
        analytics.averageDuration = Math.round(analytics.totalDuration / answeredCalls.length);
      }

      // Calls by day
      calls.forEach(call => {
        const day = new Date(call.startTime).toDateString();
        analytics.callsByDay[day] = (analytics.callsByDay[day] || 0) + 1;
      });

      // Calls by hour
      calls.forEach(call => {
        const hour = new Date(call.startTime).getHours();
        analytics.callsByHour[hour] = (analytics.callsByHour[hour] || 0) + 1;
      });

      // Status distribution
      calls.forEach(call => {
        analytics.statusDistribution[call.status] = 
          (analytics.statusDistribution[call.status] || 0) + 1;
      });

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('Failed to get call analytics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Schedule follow-up based on call outcome
  scheduleFollowUp: async (callId, followUpData) => {
    try {
      const followUp = {
        id: Date.now().toString(),
        callId,
        ...followUpData,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, would save to backend)
      const savedFollowUps = localStorage.getItem('call_followups');
      const followUps = savedFollowUps ? JSON.parse(savedFollowUps) : [];
      followUps.unshift(followUp);
      
      localStorage.setItem('call_followups', JSON.stringify(followUps));

      return {
        success: true,
        data: followUp
      };
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get pending follow-ups
  getPendingFollowUps: async () => {
    try {
      const savedFollowUps = localStorage.getItem('call_followups');
      const followUps = savedFollowUps ? JSON.parse(savedFollowUps) : [];
      
      const now = new Date();
      const pendingFollowUps = followUps.filter(followUp => {
        return followUp.status !== 'completed' && new Date(followUp.scheduledDate) <= now;
      });

      return {
        success: true,
        data: pendingFollowUps
      };
    } catch (error) {
      console.error('Failed to get pending follow-ups:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get call status options
  getCallStatusOptions: () => {
    return [
      { value: 'answered', label: 'Answered', color: 'success', icon: 'PhoneCall' },
      { value: 'not_answered', label: 'Not Answered', color: 'warning', icon: 'PhoneMissed' },
      { value: 'busy', label: 'Busy', color: 'error', icon: 'PhoneBusy' },
      { value: 'switched_off', label: 'Switched Off', color: 'secondary', icon: 'PhoneOff' },
      { value: 'invalid_number', label: 'Invalid Number', color: 'error', icon: 'PhoneX' },
      { value: 'declined', label: 'Declined', color: 'error', icon: 'PhoneDecline' }
    ];
  },

  // Validate phone number
  validatePhoneNumber: (phoneNumber) => {
    // Basic phone number validation
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.length < 10) {
      return {
        valid: false,
        error: 'Phone number must be at least 10 digits'
      };
    }
    
    if (cleanNumber.length > 15) {
      return {
        valid: false,
        error: 'Phone number cannot exceed 15 digits'
      };
    }
    
    return {
      valid: true,
      formatted: cleanNumber
    };
  },

  // Format call duration
  formatDuration: (seconds) => {
    if (!seconds || seconds < 0) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  },

  // Open device dialer
  openDialer: (phoneNumber) => {
    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const telUrl = `tel:${cleanNumber}`;
      
      // Create a temporary link and click it to open dialer
      const link = document.createElement('a');
      link.href = telUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return {
        success: true,
        phoneNumber: cleanNumber
      };
    } catch (error) {
      console.error('Failed to open dialer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default callsApi;