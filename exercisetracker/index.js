const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Connect to database
const URI = process.env['MONGO_URI'];
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define database schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: new Date() }
});

// Define models
const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

// Handle POST requests to add users to database
app.post('/api/users', (req, res) => {
  // Get username from form body
  const username = req.body.username;
  if (username) {
    // Check if username already exists in database
    User.findOne({ username: username })
      .then((user) => {
        // If user already in database
        if (user) {
          res.json({
            username: user.username,
            _id: user._id
          });
        } else {
          // Add to database and return result
          User.create({ username: username })
            .then((newUser) => {
              if (newUser) {
                res.json({
                  username: newUser.username,
                  _id: newUser._id
                });
              }
            }).catch((error) => console.log(error));
        }
      }).catch((error) => console.log(error));
  } else { res.json({ error: 'invalid username' }); }
});

// Handle POST requests to add exercise sessions for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  // Get parameters
  const user_id = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;

  if (user_id) {
    // Find user in database
    User.findById(user_id)
      .then((user) => {
        if (user) {
          const exercise_input = {
            user_id: user_id,
            description: description,
            duration: duration
          }
          if (date) {
            // Add date if given
            exercise_input.date = new Date(date);
          }
          // Add exercise session to database
          Exercise.create(exercise_input)
            .then((exercise) => {
              if (exercise) {
                res.json({
                  _id: exercise.user_id,
                  username: user.username,
                  date: exercise.date.toDateString(),
                  duration: exercise.duration,
                  description: exercise.description
                });
              }
            }).catch((error) => console.log(error));
        } else { res.json({ error: 'invalid user id' }); }
      }).catch((error) => console.log(error));
  } else { res.json({ error: 'invalid user id' }); }
});

// Get all users
app.get('/api/users', (req, res) => {
  User.find().then((users) => res.json(users));
});

// Handle GET requests for user's records with optional
// from, to, and limit constraints:
// GET /api/users/:_id/logs?[from=][&to][&limit]
app.get('/api/users/:_id/logs', (req, res) => {
  // Get parameters and optional query constraints
  const user_id = req.params._id;
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;

  // Find user 
  User.findById(user_id)
    .then((user) => {
      if (user) {
        // Get exercise log for user
        Exercise.find({ user_id: user_id })
          .then((log) => {
            // Apply optional constraints
            if (from) {
              const fromDate = new Date(from);
              log = log.filter( (exercise) => (exercise.date >= fromDate));
            }
            if (to) {
              const toDate = new Date(to);
              log = log.filter( (exercise) => (exercise.date <= toDate));
            }
            if (limit) {
             log = log.slice(0,limit);
            }
            // Format log
            log = log.map( (exercise) => ({
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date.toDateString()
            }));            
            res.json({
              _id: user._id,
              username: user.username,
              count: log.length,
              log: log
            });
          }).catch((error) => console.log(error));
      }
    }).catch((error) => console.log(error));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});