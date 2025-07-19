const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
  followUpStatus: String
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

// Dynamic Field Schema
const fieldSchema = new mongoose.Schema({
  name: String,
  label: String,
  type: String,
  entityType: String,
  options: [String],
  validation: Object,
  position: Number,
  required: Boolean,
  defaultValue: String,
  createdAt: { type: Date, default: Date.now }
});
const Field = mongoose.model('Field', fieldSchema);

// Interaction Schema
const interactionSchema = new mongoose.Schema({
  contactId: String,
  type: String,
  outcome: String,
  duration: Number,
  notes: String,
  metadata: Object,
  source: String,
  timestamp: { type: Date, default: Date.now }
});
const Interaction = mongoose.model('Interaction', interactionSchema);

// Call Schema
const callSchema = new mongoose.Schema({
  contactId: String,
  phoneNumber: String,
  contactName: String,
  status: String,
  duration: Number,
  notes: String,
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
});
const Call = mongoose.model('Call', callSchema);

// WhatsApp Template Schema
const whatsappTemplateSchema = new mongoose.Schema({
  name: String,
  category: String,
  language: String,
  components: Array,
  variables: [String],
  status: String,
  createdAt: { type: Date, default: Date.now }
});
const WhatsAppTemplate = mongoose.model('WhatsAppTemplate', whatsappTemplateSchema);

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

// --- Dynamic Fields API ---

// Get fields for an entity type
app.get('/api/fields/:entityType', async (req, res) => {
  try {
    const fields = await Field.find({ entityType: req.params.entityType }).sort({ position: 1 });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new field
app.post('/api/fields', async (req, res) => {
  try {
    const field = new Field(req.body);
    await field.save();
    res.status(201).json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a field
app.put('/api/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!field) return res.status(404).json({ error: 'Field not found' });
    res.json(field);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a field
app.delete('/api/fields/:id', async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Interactions API ---

// Get interactions for a contact
app.get('/api/interactions', async (req, res) => {
  try {
    const { contactId, type, dateFrom, dateTo } = req.query;
    const filters = {};
    
    if (contactId) filters.contactId = contactId;
    if (type) filters.type = type;
    if (dateFrom || dateTo) {
      filters.timestamp = {};
      if (dateFrom) filters.timestamp.$gte = new Date(dateFrom);
      if (dateTo) filters.timestamp.$lte = new Date(dateTo);
    }
    
    const interactions = await Interaction.find(filters).sort({ timestamp: -1 });
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new interaction
app.post('/api/interactions', async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an interaction
app.put('/api/interactions/:id', async (req, res) => {
  try {
    const interaction = await Interaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an interaction
app.delete('/api/interactions/:id', async (req, res) => {
  try {
    await Interaction.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Calls API ---

// Get call history
app.get('/api/calls', async (req, res) => {
  try {
    const { contactId, status, dateFrom, dateTo } = req.query;
    const filters = {};
    
    if (contactId) filters.contactId = contactId;
    if (status) filters.status = status;
    if (dateFrom || dateTo) {
      filters.startTime = {};
      if (dateFrom) filters.startTime.$gte = new Date(dateFrom);
      if (dateTo) filters.startTime.$lte = new Date(dateTo);
    }
    
    const calls = await Call.find(filters).sort({ startTime: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new call log
app.post('/api/calls', async (req, res) => {
  try {
    const call = new Call(req.body);
    await call.save();
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a call
app.put('/api/calls/:id', async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a call
app.delete('/api/calls/:id', async (req, res) => {
  try {
    await Call.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- WhatsApp Templates API ---

// Get WhatsApp templates
app.get('/api/whatsapp/templates', async (req, res) => {
  try {
    const templates = await WhatsAppTemplate.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new WhatsApp template
app.post('/api/whatsapp/templates', async (req, res) => {
  try {
    const template = new WhatsAppTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a WhatsApp template
app.put('/api/whatsapp/templates/:id', async (req, res) => {
  try {
    const template = await WhatsAppTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a WhatsApp template
app.delete('/api/whatsapp/templates/:id', async (req, res) => {
  try {
    await WhatsAppTemplate.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- WhatsApp Messages API ---

// Log WhatsApp message
app.post('/api/whatsapp/messages', async (req, res) => {
  try {
    // Log as interaction
    const interaction = new Interaction({
      contactId: req.body.contactId,
      type: 'whatsapp',
      outcome: req.body.outcome || 'sent',
      notes: req.body.notes || '',
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
