const express = require('express');
const Device = require('../models/Device');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
router.get('/', authenticate, async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/', authenticate, async (req, res) => {
  const { name, type } = req.body;

  try {
    const device = new Device({ name, type, user: req.user });
    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/:id', authenticate, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    device.status = !device.status;
    await device.save();

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
const Project = require('../models/Project'); 
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find(); 
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newProject = new Project({ name });
    await newProject.save();
    res.status(201).json(newProject); 
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});
module.exports = router; 