const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  projectId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },

  widgets: [
    {
      type: { type: String },
      name: { type: String },
      label: {type: String},
    },
  ],
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;