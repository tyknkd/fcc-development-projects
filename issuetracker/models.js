const mongoose = require('mongoose');

// Database schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const issueSchema = new mongoose.Schema({
  project_id: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
  assigned_to: { type: String, default: '' },
  status_text: { type: String, default: '' },
  open: { type: Boolean, default: true }
});

// Models
const Project = mongoose.model('Project', projectSchema);
const Issue = mongoose.model('Issue', issueSchema);

module.exports = { Project, Issue }