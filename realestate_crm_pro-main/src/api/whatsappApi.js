import axios from 'axios';

// WhatsApp API Configuration
const WHATSAPP_API_CONFIG = {
  baseURL: 'https://app.waofficial.com/api/integration/whatsapp-message',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create WhatsApp API client
const whatsappClient = axios.create(WHATSAPP_API_CONFIG);

// WhatsApp API Service
export const whatsappApi = {
  // Send a WhatsApp message
  sendMessage: async (phoneNumberId, message, accessToken) => {
    try {
      const response = await whatsappClient.post(
        `/${phoneNumberId}/messages`,
        message,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );
      
      return {
        success: true,
        data: response.data,
        messageId: response.data.messages?.[0]?.id,
        status: response.status
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message,
        status: error.response?.status,
        code: error.response?.data?.error?.code
      };
    }
  },

  // Send template message
  sendTemplateMessage: async (phoneNumberId, templateData, accessToken) => {
    const message = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: templateData.to,
      type: "template",
      template: {
        name: templateData.templateName,
        language: {
          code: templateData.languageCode || "en"
        },
        components: templateData.components || []
      }
    };

    return await whatsappApi.sendMessage(phoneNumberId, message, accessToken);
  },

  // Send text message
  sendTextMessage: async (phoneNumberId, to, text, accessToken) => {
    const message = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        body: text
      }
    };

    return await whatsappApi.sendMessage(phoneNumberId, message, accessToken);
  },

  // Send media message
  sendMediaMessage: async (phoneNumberId, to, mediaData, accessToken) => {
    const message = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: mediaData.type, // 'image', 'document', 'video'
      [mediaData.type]: {
        link: mediaData.url,
        caption: mediaData.caption || ""
      }
    };

    return await whatsappApi.sendMessage(phoneNumberId, message, accessToken);
  },

  // Send bulk messages
  sendBulkMessages: async (phoneNumberId, recipients, messageTemplate, accessToken) => {
    const results = [];
    
    // Process in batches to respect rate limits
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          // Replace variables in message template
          const personalizedMessage = whatsappApi.replaceVariables(messageTemplate, recipient.variables || {});
          
          const result = await whatsappApi.sendTextMessage(
            phoneNumberId,
            recipient.phone,
            personalizedMessage,
            accessToken
          );
          
          return {
            recipient: recipient.phone,
            success: result.success,
            messageId: result.messageId,
            error: result.error
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
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return {
      success: true,
      results: results,
      total: recipients.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  },

  // Replace variables in message template
  replaceVariables: (template, variables) => {
    let message = template;
    
    // Replace {{variable}} patterns
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, variables[key] || '');
    });
    
    return message;
  },

  // Validate phone number format
  validatePhoneNumber: (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid international format
    if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
      return {
        valid: true,
        formatted: cleanPhone
      };
    }
    
    return {
      valid: false,
      error: 'Phone number must be 10-15 digits'
    };
  },

  // Create template component for header with image
  createHeaderComponent: (imageUrl) => ({
    type: "header",
    parameters: [
      {
        type: "image",
        image: {
          link: imageUrl
        }
      }
    ]
  }),

  // Create template component for body with text variables
  createBodyComponent: (variables) => ({
    type: "body",
    parameters: variables.map(variable => ({
      type: "text",
      text: variable
    }))
  }),

  // Get message delivery status (mock implementation)
  getMessageStatus: async (messageId, accessToken) => {
    // This would typically query the WhatsApp API for message status
    // For now, returning mock data
    return {
      success: true,
      data: {
        id: messageId,
        status: 'delivered', // sent, delivered, read, failed
        timestamp: new Date().toISOString(),
        recipient_id: 'unknown'
      }
    };
  }
};

// WhatsApp Template Management
export const templateApi = {
  // Get available templates (mock implementation)
  getTemplates: async () => {
    // This would typically fetch from WhatsApp Business API
    const mockTemplates = [
      {
        id: 'welcome_message',
        name: 'welcome_message',
        language: 'en',
        status: 'APPROVED',
        category: 'MARKETING',
        components: [
          {
            type: 'HEADER',
            format: 'TEXT',
            text: 'Welcome to {{1}}'
          },
          {
            type: 'BODY',
            text: 'Hi {{1}}, welcome to our real estate family! We are excited to help you find your dream property. Our team will be in touch shortly to understand your requirements.'
          }
        ]
      },
      {
        id: 'property_update',
        name: 'property_update',
        language: 'en',
        status: 'APPROVED',
        category: 'MARKETING',
        components: [
          {
            type: 'HEADER',
            format: 'IMAGE'
          },
          {
            type: 'BODY',
            text: 'New property alert! {{1}} is now available. {{2}} apartments starting from {{3}}. Book your site visit today!'
          }
        ]
      },
      {
        id: 'site_visit_reminder',
        name: 'site_visit_reminder',
        language: 'en',
        status: 'APPROVED',
        category: 'UTILITY',
        components: [
          {
            type: 'BODY',
            text: 'Hi {{1}}, reminder about your site visit tomorrow at {{2}} for {{3}}. Our sales executive will meet you at the property location.'
          }
        ]
      }
    ];

    return {
      success: true,
      data: mockTemplates
    };
  },

  // Validate template variables
  validateTemplate: (template, variables) => {
    const errors = [];
    
    // Check if all required variables are provided
    template.components.forEach(component => {
      if (component.type === 'BODY' || component.type === 'HEADER') {
        const matches = component.text?.match(/{{(\d+)}}/g) || [];
        matches.forEach(match => {
          const index = parseInt(match.replace(/[{}]/g, '')) - 1;
          if (!variables[index]) {
            errors.push(`Missing variable for ${match}`);
          }
        });
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

export default whatsappApi;