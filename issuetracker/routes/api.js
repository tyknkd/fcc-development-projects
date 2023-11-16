'use strict';

const { Project, Issue } = require('../models');

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get((req, res) => {
      // Get project parameter and optional query constraints
      const project_name = req.params.project;

      // Find project
      Project.findOne({ name: project_name })
        .then((project) => {
          if (project) {
            // Create query JSON
            const query = {
              project_id: project._id,
              ...req.query
            };
            // Get issues
            Issue.find(query)
              .then((issues) => {
                if (issues) {
                  if (issues.length > 0) {
                    // Format issue output
                    issues = issues.map((issue) => ({
                      _id: issue._id,
                      issue_title: issue.issue_title,
                      issue_text: issue.issue_text,
                      created_by: issue.created_by,
                      created_on: issue.created_on,
                      updated_on: issue.updated_on,
                      assigned_to: issue.assigned_to,
                      status_text: issue.status_text,
                      open: issue.open
                    }));
                  }
                  res.json(issues);
                } else { res.json([]) }
              }).catch((error) => console.error(error));
          } else {
            res.json({ error: 'No such project', project_name: project_name });
          }
        }).catch((error) => console.error(error));
    })

    .post(function(req, res) {
      // Get project parameter and input form data
      const project_name = req.params.project;
      const { issue_title, issue_text, created_by,
        assigned_to, status_text } = req.body;

      // Check that all required values are included
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
      } else {
        // Check if project already exists
        Project.findOne({ name: project_name })
          .then((project) => {
            // If already in database
            if (project) {
              // Add issue
              Issue.create({
                project_id: project._id,
                ...req.body
              }).then((issue) => {
                if (issue) {
                  res.json({
                    _id: issue._id,
                    issue_title: issue.issue_title,
                    issue_text: issue.issue_text,
                    created_on: issue.created_on,
                    updated_on: issue.updated_on,
                    created_by: issue.created_by,
                    assigned_to: issue.assigned_to,
                    open: issue.open,
                    status_text: issue.status_text
                  });
                } else {
                  res.json({
                    error: 'Issue not added',
                    issue_title: issue_title
                  });
                }
              }).catch((error) => console.error(error));
            } else {
              // Add it
              Project.create({ name: project_name })
                .then((new_project) => {
                  if (new_project) {
                    // Add issue
                    Issue.create({
                      project_id: new_project._id,
                      ...req.body
                    }).then((issue) => {
                      if (issue) {
                        res.json({
                          _id: issue._id,
                          issue_title: issue.issue_title,
                          issue_text: issue.issue_text,
                          created_on: issue.created_on,
                          updated_on: issue.updated_on,
                          created_by: issue.created_by,
                          assigned_to: issue.assigned_to,
                          open: issue.open,
                          status_text: issue.status_text
                        });
                      } else {
                        res.json({
                          error: 'Issue not added',
                          issue_title: issue_title
                        });
                      }
                    }).catch((error) => console.error(error));
                  }
                }).catch((error) => console.error(error));
            }
          }).catch((error) => console.error(error));
      }
    })

    .put(function(req, res) {
      // Get project parameter and input form data
      const project_name = req.params.project;
      const { _id, issue_title, issue_text,
        created_by, assigned_to, status_text, open } = req.body;

      // Check that ID is included
      if (_id) {
        // Check that at least one update field is included
        if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
          res.json({ error: 'no update field(s) sent', _id: _id });
        } else {
          // Check if project already exists
          Project.findOne({ name: project_name })
            .then((project) => {
              if (project) {
                // Create filter JSON
                const filter = {
                  _id: _id,
                  project_id: project._id
                };
                // Create update JSON
                let update = {
                  project_id: project._id,
                  ...req.body,
                  updated_on: new Date()
                };
                // Check if issue exists and update if it does
                Issue.findOneAndUpdate(filter, update, { new: true })
                  .then((issue) => {
                    if (issue) {
                      res.json({
                        result: 'successfully updated',
                        _id: issue._id
                      });
                    } else {
                      res.json({
                        error: 'could not update',
                        '_id': _id
                      });
                    }
                  }).catch((error) => console.error(error));
              } else {
                res.json({
                  error: 'could not update',
                  '_id': _id
                });
              }
            }).catch((error) => console.error(error));
        }
      } else {
        res.json({ error: 'missing _id' });
      }
    })

    .delete(function(req, res) {
      // Get project parameter and input form data
      const project_name = req.params.project;
      const _id = req.body._id;
      // Check that ID is included
      if (_id) {
        // Check if project already exists
        Project.findOne({ name: project_name })
          .then((project) => {
            if (project) {
              // Delete issue, if it exists
              Issue.findOneAndDelete({ _id: _id })
                .then((issue) => {
                  if (issue) {
                    res.json({
                      result: 'successfully deleted',
                      _id: issue._id
                    });
                  } else {
                    res.json({
                      error: 'could not delete',
                      '_id': _id
                    });
                  }
                }).catch((error) => console.error(error));
            } else {
              res.json({
                error: 'could not delete',
                '_id': _id
              });
            }
          }).catch((error) => console.error(error));
      } else { res.json({ error: 'missing _id' }); }
    });
};
