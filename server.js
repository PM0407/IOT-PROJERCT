// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const Project = require('./models/Project');
const amqp = require('amqplib');
const mqtt = require('mqtt');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// RabbitMQ Connection
let channel;
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};
connectRabbitMQ();

// MQTT Broker over WebSocket
const mqttClient = mqtt.connect('ws://localhost:15675/ws', {
  username: 'guest',
  password: 'guest'
});

mqttClient.on('connect', () => {
  console.log('MQTT client connected via WebSocket');
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()} from topic: ${topic}`);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/projects', projectRoutes);

// Middleware for authorization check on specific routes
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'Access denied' });
  next();
});

// Get Project by ID
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).send('Project not found');
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send('Server error');
  }
});

// Delete Project by ID
app.delete('/api/projects/:projectId', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a RabbitMQ Topic
app.post('/api/createTopic', async (req, res) => {
  const { label, username, projectId } = req.body;
  const uniqueTopic = `${username}_${projectId}_${label}`;

  try {
    if (!channel) return res.status(500).json({ message: 'RabbitMQ channel not initialized' });

    await channel.assertQueue(uniqueTopic, { durable: false });
    await channel.sendToQueue(uniqueTopic, Buffer.from(`Topic ${uniqueTopic} created successfully`));

    res.json({ message: `Topic ${uniqueTopic} created successfully` });
  } catch (error) {
    console.error('Failed to create RabbitMQ topic:', error);
    res.status(500).json({ message: 'Failed to create topic' });
  }
});

// Server listening on specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
