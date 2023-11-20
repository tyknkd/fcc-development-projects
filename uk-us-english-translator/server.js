'use strict';

const express = require('express');
const expect = require('chai').expect;
const cors = require('cors');
require('dotenv').config();

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const userRoutes = require('./routes/api.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
userRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Start our server and tests!
app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
