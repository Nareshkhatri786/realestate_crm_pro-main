const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// const bcrypt = require('bcryptjs'); // Uncomment if you want to use hashed passwords
const app = express();
const PORT = 5000;

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/realestatecrm';
const JWT_SECRET = 'your_jwt_secret_key'; // Change this to a secure value!

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('MongoDB connected!'));

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  source: String,
  project: String,
  assignedTo: String,
  status: String,
  nurturingStage: String,
  nurturingProgress: Number,
  lastContact: String,
  lastContactType: String,
  createdDate: String,
  budget: String,
  unitType: String,
  timeline: String,
  followUpStatus: String,
  customFields: { type: Map, of: mongoose.Schema.Types.Mixed }
});
const Lead = mongoose.model('Lead', leadSchema);

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // For production, store hashed passwords!
  role: String,
  name: String
});
const User = mongoose.model('User', userSchema);

// Custom Fields Schema (enhanced version)
const customFieldSchema = new mongoose.Schema({
  entityType: { type: String, required: true }, // 'lead', 'property', 'contact'
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true }, // 'text', 'number', 'dropdown', etc.
  required: { type: Boolean, default: false },
  options: [String],
  placeholder: String,
  validation: mongoose.Schema.Types.Mixed,
  conditionalLogic: mongoose.Schema.Types.Mixed,
  order: { type: Number, default: 0 },
  position: Number, // for backward compatibility
  defaultValue: String, // for backward compatibility
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const CustomField = mongoose.model('CustomField', customFieldSchema);
// Alias for backward compatibility
const Field = CustomField;

// WhatsApp Template Schema (enhanced version)
const whatsappTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // 'MARKETING', 'UTILITY', 'AUTHENTICATION'
  language: { type: String, default: 'en' },
  components: [mongoose.Schema.Types.Mixed],
  variables: [String],
  status: { type: String, default: 'DRAFT' }, // 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED'
  approvedBy: String,
  approvedAt: Date,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const WhatsappTemplate = mongoose.model('WhatsappTemplate', whatsappTemplateSchema);
// Alias for backward compatibility
const WhatsAppTemplate = WhatsappTemplate;

// WhatsApp Message Schema
const whatsappMessageSchema = new mongoose.Schema({
  recipientPhone: { type: String, required: true },
  recipientName: String,
  messageType: { type: String, required: true }, // 'text', 'template', 'media'
  content: mongoose.Schema.Types.Mixed,
  templateName: String,
  campaignId: String,
  messageId: String, // WhatsApp API message ID
  status: { type: String, default: 'sent' }, // 'sent', 'delivered', 'read', 'failed'
  deliveredAt: Date,
  readAt: Date,
  failureReason: String,
  direction: { type: String, default: 'sent' }, // 'sent', 'received'
  sentBy: String,
  createdAt: { type: Date, default: Date.now }
});
const WhatsappMessage = mongoose.model('WhatsappMessage', whatsappMessageSchema);

// Campaign Schema
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, required: true }, // 'whatsapp', 'email', 'sms'
  templateId: String,
  audienceCriteria: mongoose.Schema.Types.Mixed,
  scheduledDate: Date,
  status: { type: String, default: 'draft' }, // 'draft', 'scheduled', 'active', 'paused', 'completed'
  metrics: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
    replied: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Campaign = mongoose.model('Campaign', campaignSchema);

// Call Log Schema (enhanced version)
const callLogSchema = new mongoose.Schema({
  contactId: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactName: String,
  status: { type: String, required: true }, // 'answered', 'not_answered', 'switched_off', 'busy', 'invalid'
  duration: { type: Number, default: 0 }, // in seconds
  notes: String,
  followUpAction: String,
  outcome: String,
  scheduledFollowUp: Date,
  startTime: Date, // for backward compatibility
  endTime: Date, // for backward compatibility
  createdBy: String,
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now } // for backward compatibility
});
const CallLog = mongoose.model('CallLog', callLogSchema);
// Alias for backward compatibility
const Call = CallLog;

// Interaction Schema (enhanced version)
const interactionSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  entityType: { type: String, required: true }, // 'lead', 'contact', 'property'
  entityName: String,
  contactId: String, // for backward compatibility
  type: { type: String, required: true }, // 'call', 'whatsapp', 'email', 'meeting', 'site_visit', 'note'
  title: { type: String, required: true },
  description: String,
  outcome: String,
  nextAction: String,
  scheduledDate: Date,
  priority: { type: String, default: 'medium' }, // 'low', 'medium', 'high'
  metadata: mongoose.Schema.Types.Mixed,
  autoGenerated: { type: Boolean, default: false },
  createdBy: String,
  source: String, // for backward compatibility
  notes: String, // for backward compatibility
  duration: Number, // for backward compatibility
  timestamp: { type: Date, default: Date.now }
});
const Interaction = mongoose.model('Interaction', interactionSchema);

// Settings Schema
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  category: String, // 'whatsapp', 'general', 'notifications'
  description: String,
  updatedBy: String,
  updatedAt: { type: Date, default: Date.now }
});
const Settings = mongoose.model('Settings', settingsSchema);

// Authentication endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // Fetch user from DB
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // If using hashed passwords, use bcrypt.compare
  // const valid = await bcrypt.compare(password, user.password);
  // If storing plain text passwords (not recommended!):
  const valid = user.password === password;
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate JWT token
  const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Endpoints

// Get all leads
app.get('/api/leads', async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// Add a new lead
app.post('/api/leads', async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.status(201).json(lead);
});

// Update a lead
app.put('/api/leads/:id', async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Delete a lead
app.delete('/api/leads/:id', async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// === CUSTOM FIELDS API ===

// Get custom fields for an entity type (supporting both new and legacy endpoints)
app.get('/api/custom-fields/:entityType', async (req, res) => {
  try {
    const fields = await CustomField.find({ 
      entityType: req.params.entityType,
      isActive: true 
    }).sort({ order: 1, position: 1 });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint for backward compatibility
app.get('/api/fields/:entityType', async (req, res) => {
  try {
    const fields = await CustomField.find({ 
      entityType: req.params.entityType,
      isActive: true 
    }).sort({ order: 1, position: 1 });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new custom field (supporting both endpoints)
app.post('/api/custom-fields', async (req, res) => {
  try {
    const field = new CustomField(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/fields', async (req, res) => {
  try {
    const field = new CustomField(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a custom field (supporting both endpoints)
app.put('/api/custom-fields/:id', async (req, res) => {
  try {
    const field = await CustomField.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true }
    );
    if (!field) return res.status(404).json({ error: 'Field not found' });
    res.json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/fields/:id', async (req, res) => {
  try {
    const field = await CustomField.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: new Date() }, 
      { new: true }
    );
    if (!field) return res.status(404).json({ error: 'Field not found' });
    res.json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a custom field (supporting both endpoints)
app.delete('/api/custom-fields/:id', async (req, res) => {
  try {
    await CustomField.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fields/:id', async (req, res) => {
  try {
    await CustomField.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === WHATSAPP API ===

// Get WhatsApp templates
app.get('/api/whatsapp/templates', async (req, res) => {
  try {
    const templates = await WhatsappTemplate.find({ status: { $ne: 'REJECTED' } })
      .sort({ updatedAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new WhatsApp template
app.post('/api/whatsapp/templates', async (req, res) => {
  try {
    const template = new WhatsappTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a WhatsApp template
app.put('/api/whatsapp/templates/:id', async (req, res) => {
  try {
    const template = await WhatsappTemplate.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a WhatsApp template
app.delete('/api/whatsapp/templates/:id', async (req, res) => {
  try {
    await WhatsappTemplate.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send WhatsApp message
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phoneNumberId, to, messageType, content, templateName } = req.body;
    
    // Get WhatsApp API token from settings
    const tokenSetting = await Settings.findOne({ key: 'whatsapp_api_token' });
    const apiToken = tokenSetting?.value || process.env.WHATSAPP_API_TOKEN;
    
    if (!apiToken) {
      return res.status(400).json({ error: 'WhatsApp API token not configured' });
    }

    // Prepare API request
    const apiUrl = `https://app.waofficial.com/api/integration/whatsapp-message/${phoneNumberId}/messages`;
    
    let payload;
    
    if (messageType === 'template') {
      const template = await WhatsappTemplate.findOne({ name: templateName });
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "template",
        template: {
          name: template.name,
          language: { code: template.language },
          components: template.components
        }
      };
    } else {
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: { body: content }
      };
    }

    // Send to WhatsApp API
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Save message log
    const messageLog = new WhatsappMessage({
      recipientPhone: to,
      messageType,
      content: messageType === 'template' ? { templateName } : { text: content },
      templateName,
      messageId: response.data.messages?.[0]?.id,
      status: 'sent',
      sentBy: req.user?.email || 'system'
    });
    await messageLog.save();

    res.json({
      success: true,
      messageId: response.data.messages?.[0]?.id,
      messageLog: messageLog
    });

  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to send WhatsApp message',
      details: error.response?.data || error.message 
    });
  }
});

// Log WhatsApp message (for backward compatibility)
app.post('/api/whatsapp/messages', async (req, res) => {
  try {
    // Log as interaction
    const interaction = new Interaction({
      entityId: req.body.contactId,
      entityType: 'lead',
      type: 'whatsapp',
      title: 'WhatsApp Message',
      outcome: req.body.outcome || 'sent',
      description: req.body.notes || '',
      metadata: {
        messageType: req.body.messageType,
        templateId: req.body.templateId,
        phoneNumber: req.body.phoneNumber
      },
      source: 'api'
    });
    
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get WhatsApp message history
app.get('/api/whatsapp/messages', async (req, res) => {
  try {
    const { contactId, phone, limit = 50, page = 1 } = req.query;
    let query = {};
    
    if (contactId) query.contactId = contactId;
    if (phone) query.recipientPhone = phone;
    
    const messages = await WhatsappMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await WhatsappMessage.countDocuments(query);
    
    res.json({
      messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === CAMPAIGNS API ===

// Get campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ updatedAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update campaign
app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// === CALL LOGS API ===

// Get call logs (enhanced version supporting both legacy and new endpoints)
app.get('/api/call-logs', async (req, res) => {
  try {
    const { contactId, status, dateFrom, dateTo, limit = 50, page = 1 } = req.query;
    let query = {};
    
    if (contactId) query.contactId = contactId;
    if (status) query.status = status;
    if (dateFrom || dateTo) {
      query.timestamp = {};
      if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
      if (dateTo) query.timestamp.$lte = new Date(dateTo);
    }
    
    const callLogs = await CallLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await CallLog.countDocuments(query);
    
    res.json({
      callLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy endpoint for calls
app.get('/api/calls', async (req, res) => {
  try {
    const { contactId, status, dateFrom, dateTo } = req.query;
    const filters = {};
    
    if (contactId) filters.contactId = contactId;
    if (status) filters.status = status;
    if (dateFrom || dateTo) {
      filters.timestamp = {};
      if (dateFrom) filters.timestamp.$gte = new Date(dateFrom);
      if (dateTo) filters.timestamp.$lte = new Date(dateTo);
    }
    
    const calls = await CallLog.find(filters).sort({ timestamp: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create call log (enhanced version)
app.post('/api/call-logs', async (req, res) => {
  try {
    const callLog = new CallLog(req.body);
    await callLog.save();
    
    // Auto-create interaction log
    const interaction = new Interaction({
      entityId: callLog.contactId,
      entityType: 'lead', // or determine dynamically
      entityName: callLog.contactName,
      type: 'call',
      title: `${callLog.status === 'answered' ? 'Successful' : 'Attempted'} Call`,
      description: callLog.notes || `Call ${callLog.status}${callLog.duration ? ` - Duration: ${Math.floor(callLog.duration/60)}m ${callLog.duration%60}s` : ''}`,
      metadata: {
        status: callLog.status,
        duration: callLog.duration,
        phone: callLog.contactPhone
      },
      autoGenerated: true,
      createdBy: callLog.createdBy
    });
    await interaction.save();
    
    res.status(201).json({ callLog, interaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Legacy create call endpoint
app.post('/api/calls', async (req, res) => {
  try {
    const call = new CallLog(req.body);
    await call.save();
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update call (supporting both endpoints)
app.put('/api/calls/:id', async (req, res) => {
  try {
    const call = await CallLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete call (supporting both endpoints)
app.delete('/api/calls/:id', async (req, res) => {
  try {
    await CallLog.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === INTERACTIONS API ===

// Get interactions (enhanced version supporting both query styles)
app.get('/api/interactions', async (req, res) => {
  try {
    const { entityId, entityType, contactId, type, dateFrom, dateTo, limit = 50, page = 1 } = req.query;
    let query = {};
    
    // Support both entityId and contactId for backward compatibility
    if (entityId) query.entityId = entityId;
    if (contactId) query.entityId = contactId; // map contactId to entityId
    if (entityType) query.entityType = entityType;
    if (type) query.type = type;
    
    if (dateFrom || dateTo) {
      query.timestamp = {};
      if (dateFrom) query.timestamp.$gte = new Date(dateFrom);
      if (dateTo) query.timestamp.$lte = new Date(dateTo);
    }
    
    const interactions = await Interaction.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await Interaction.countDocuments(query);
    
    res.json({
      interactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
// Create interaction
app.post('/api/interactions', async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update interaction
app.put('/api/interactions/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete interaction
app.delete('/api/interactions/:id', async (req, res) => {
  try {
    await Interaction.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/api/interactions/:id', async (req, res) => {
  try {
    await Interaction.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === SETTINGS API ===

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) query.category = category;
    
    const settings = await Settings.find(query);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
app.put('/api/settings/:key', async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { 
        value: req.body.value,
        updatedBy: req.user?.email || 'system',
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// === ANALYTICS API ===

// Get dashboard analytics
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Lead stats
    const totalLeads = await Lead.countDocuments();
    const newLeadsThisMonth = await Lead.countDocuments({
      createdDate: { $gte: thirtyDaysAgo.toISOString() }
    });
    
    // Call stats
    const totalCalls = await CallLog.countDocuments();
    const callsThisMonth = await CallLog.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });
    const answeredCalls = await CallLog.countDocuments({
      status: 'answered',
      timestamp: { $gte: thirtyDaysAgo }
    });
    
    // WhatsApp stats
    const totalMessages = await WhatsappMessage.countDocuments();
    const messagesThisMonth = await WhatsappMessage.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    const deliveredMessages = await WhatsappMessage.countDocuments({
      status: 'delivered',
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Interaction stats
    const totalInteractions = await Interaction.countDocuments();
    const interactionsThisMonth = await Interaction.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      leads: {
        total: totalLeads,
        thisMonth: newLeadsThisMonth
      },
      calls: {
        total: totalCalls,
        thisMonth: callsThisMonth,
        answered: answeredCalls,
        answerRate: callsThisMonth > 0 ? Math.round((answeredCalls / callsThisMonth) * 100) : 0
      },
      whatsapp: {
        total: totalMessages,
        thisMonth: messagesThisMonth,
        delivered: deliveredMessages,
        deliveryRate: messagesThisMonth > 0 ? Math.round((deliveredMessages / messagesThisMonth) * 100) : 0
      },
      interactions: {
        total: totalInteractions,
        thisMonth: interactionsThisMonth
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Optional: Protected Routes Example (for future use) ---
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };
// // Then use this middleware on any routes you want to protect:
// // app.get('/api/leads', authenticateToken, async (req, res) => { ... });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
