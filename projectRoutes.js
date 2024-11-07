const express = require('express');
const Project = require('../models/Project');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique project ID

// Create a new project
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  const projectId = uuidv4(); // Generate a unique project ID

  const newProject = new Project({ name, userId, projectId });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all projects for a user
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const projects = await Project.find({ userId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add widget to a project
router.patch('/:projectId', verifyToken, async (req, res) => {
  const { projectId } = req.params;
  const { widgets } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { widgets } },
      { new: true }
    );
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Project by ID
router.delete('/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});


module.exports = router;
