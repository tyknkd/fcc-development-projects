// index.js
// where your node app starts

// init project
require('dotenv').config();
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// get IP address, preferred language, and software
app.get('/api/whoami', (req, res) => {
  // get IP address 
  // Reference: https://stackabuse.com/bytes/how-to-get-a-users-ip-address-in-express-js/
 const ip = req.ip;
  // get preferred language from headers
  // Reference: https://stackoverflow.com/questions/11845471/how-can-i-get-the-browser-language-in-node-js-express-js
  const language = req.headers['accept-language'];
  // get software from headers
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
  const software = req.headers['user-agent'];
  // return JSON
  res.json({ ipaddress: ip, language: language, software: software });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
