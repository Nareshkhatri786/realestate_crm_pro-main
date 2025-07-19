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
