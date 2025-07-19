import axios from 'axios';

// WhatsApp API Configuration
const WHATSAPP_API_CONFIG = {
  baseURL: 'https://app.waofficial.com/api/integration/whatsapp-message',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};

class WhatsAppApiService {
  constructor() {
    this.client = axios.create(WHATSAPP_API_CONFIG);
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const whatsappToken = localStorage.getItem('whatsappApiToken') || 
                            import.meta.env.VITE_WHATSAPP_API_TOKEN;
        
        if (whatsappToken) {
          config.headers.Authorization = `Bearer ${whatsappToken}`;
        }
        
        console.log('WhatsApp API Request:', config.method.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('WhatsApp API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('WhatsApp API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('WhatsApp API Error:', error.response?.status, error.message);
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  handleApiError(error) {
    const errorResponse = {
      success: false,
      error: error.message,
      status: error.response?.status,
      details: error.response?.data
    };

    // Handle specific WhatsApp API errors
    if (error.response?.status === 401) {
      errorResponse.error = 'WhatsApp API authentication failed. Please check your API token.';
    } else if (error.response?.status === 429) {
      errorResponse.error = 'WhatsApp API rate limit exceeded. Please try again later.';
    } else if (error.response?.status === 400) {
      errorResponse.error = 'Invalid request format. Please check your message template.';
    }

    return errorResponse;
  }

  /**
   * Send a text message via WhatsApp
   * @param {string} phoneNumberId - Phone number ID from WhatsApp Business API
   * @param {string} to - Recipient phone number (with country code)
   * @param {string} message - Text message to send
   */
  async sendTextMessage(phoneNumberId, to, message) {
    try {
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          body: message
        }
      };

      const response = await this.client.post(`/${phoneNumberId}/messages`, payload);
      
      return {
        success: true,
        data: response.data,
        messageId: response.data.messages?.[0]?.id,
        status: response.status
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Send a template message via WhatsApp
   * @param {string} phoneNumberId - Phone number ID from WhatsApp Business API
   * @param {string} to - Recipient phone number (with country code)
   * @param {object} template - Template configuration
   */
  async sendTemplateMessage(phoneNumberId, to, template) {
    try {
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "template",
        template: {
          name: template.name,
          language: {
            code: template.language || "en"
          },
          components: template.components || []
        }
      };

      const response = await this.client.post(`/${phoneNumberId}/messages`, payload);
      
      return {
        success: true,
        data: response.data,
        messageId: response.data.messages?.[0]?.id,
        status: response.status
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Send a media message (image, document, video)
   * @param {string} phoneNumberId - Phone number ID from WhatsApp Business API
   * @param {string} to - Recipient phone number (with country code)
   * @param {object} media - Media configuration
   */
  async sendMediaMessage(phoneNumberId, to, media) {
    try {
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: media.type, // image, document, video, audio
        [media.type]: {
          link: media.url,
          caption: media.caption || undefined,
          filename: media.filename || undefined
        }
      };

      const response = await this.client.post(`/${phoneNumberId}/messages`, payload);
      
      return {
        success: true,
        data: response.data,
        messageId: response.data.messages?.[0]?.id,
        status: response.status
      };
    } catch (error) {
      return error;
    }
  }

  /**
   * Send bulk messages to multiple recipients
   * @param {string} phoneNumberId - Phone number ID from WhatsApp Business API
   * @param {Array} recipients - Array of recipient objects with phone and personalized data
   * @param {object} messageTemplate - Message template configuration
   */
  async sendBulkMessages(phoneNumberId, recipients, messageTemplate) {
    const results = [];
    const batchSize = 10; // Process in batches to avoid rate limiting
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          let result;
          
          if (messageTemplate.type === 'template') {
            // Replace variables in template components
            const personalizedTemplate = this.personalizeTemplate(messageTemplate.template, recipient.data);
            result = await this.sendTemplateMessage(phoneNumberId, recipient.phone, personalizedTemplate);
          } else {
            // Replace variables in text message
            const personalizedMessage = this.personalizeMessage(messageTemplate.message, recipient.data);
            result = await this.sendTextMessage(phoneNumberId, recipient.phone, personalizedMessage);
          }
          
          return {
            recipient: recipient.phone,
            success: result.success,
            messageId: result.messageId,
            error: result.error || null
          };
        } catch (error) {
          return {
            recipient: recipient.phone,
            success: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      success: true,
      results: results,
      summary: {
        total: recipients.length,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };
  }

  /**
   * Personalize a text message with recipient data
   * @param {string} message - Message template with variables
   * @param {object} data - Recipient data for variable substitution
   */
  personalizeMessage(message, data) {
    let personalizedMessage = message;
    
    // Replace variables in format {{variable_name}}
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      personalizedMessage = personalizedMessage.replace(regex, data[key]);
    });
    
    return personalizedMessage;
  }

  /**
   * Personalize a template with recipient data
   * @param {object} template - Template configuration
   * @param {object} data - Recipient data for variable substitution
   */
  personalizeTemplate(template, data) {
    const personalizedTemplate = JSON.parse(JSON.stringify(template)); // Deep clone
    
    // Process each component
    if (personalizedTemplate.components) {
      personalizedTemplate.components = personalizedTemplate.components.map(component => {
        if (component.parameters) {
          component.parameters = component.parameters.map(param => {
            if (param.type === 'text' && param.text) {
              param.text = this.personalizeMessage(param.text, data);
            }
            return param;
          });
        }
        return component;
      });
    }
    
    return personalizedTemplate;
  }

  /**
   * Schedule a message for future delivery
   * @param {string} phoneNumberId - Phone number ID
   * @param {object} messageData - Message configuration
   * @param {Date} scheduledTime - When to send the message
   */
  async scheduleMessage(phoneNumberId, messageData, scheduledTime) {
    // Note: WhatsApp API doesn't natively support scheduling
    // This would typically be handled by the backend scheduler
    const scheduledMessage = {
      id: `scheduled_${Date.now()}`,
      phoneNumberId,
      messageData,
      scheduledTime,
      status: 'scheduled',
      createdAt: new Date()
    };

    // Store in localStorage for now (in production, this would be backend)
    const scheduledMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
    scheduledMessages.push(scheduledMessage);
    localStorage.setItem('scheduledMessages', JSON.stringify(scheduledMessages));

    return {
      success: true,
      data: scheduledMessage
    };
  }

  /**
   * Get message delivery status
   * @param {string} messageId - Message ID returned from send operation
   */
  async getMessageStatus(messageId) {
    // Note: This would typically require webhook setup for real-time status
    // For now, return mock status data
    return {
      success: true,
      data: {
        messageId,
        status: 'delivered', // sent, delivered, read, failed
        timestamp: new Date(),
        readTimestamp: null
      }
    };
  }

  /**
   * Get available message templates
   * @param {string} phoneNumberId - Phone number ID
   */
  async getTemplates(phoneNumberId) {
    // This would typically be a separate API call to get approved templates
    // For now, return mock templates
    const mockTemplates = [
      {
        name: 'welcome_message',
        category: 'MARKETING',
        language: 'en',
        status: 'APPROVED',
        components: [
          {
            type: 'BODY',
            text: 'Welcome {{1}}! Thank you for your interest in {{2}}. Our team will contact you shortly.'
          }
        ]
      },
      {
        name: 'property_update',
        category: 'MARKETING',
        language: 'en',
        status: 'APPROVED',
        components: [
          {
            type: 'HEADER',
            format: 'IMAGE'
          },
          {
            type: 'BODY',
            text: 'New property alert! {{1}} in {{2}} is now available. {{3}} starting from {{4}}. Book your site visit today!'
          }
        ]
      }
    ];

    return {
      success: true,
      data: mockTemplates
    };
  }
}

// Create and export a singleton instance
const whatsappApiService = new WhatsAppApiService();

export default whatsappApiService;
export { WhatsAppApiService };