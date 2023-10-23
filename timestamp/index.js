// index.js
// where your node app starts

// init project
let express = require('express');
let app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
let cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Serve date in json format
app.get("/api/:date?", function(req, res) {
  // Get input date parameter
  let date = req.params.date;
  // If nonempty input parameter
  if (date) {
    // If input contains only digits
    if (/^\d+$/.test(date)) {
      // Convert to number
      date = Number(date);
    }
    // Construct date object
    const dateObj = new Date(date);
    // If invalid input parameter 
    if (dateObj.toString() === "Invalid Date") {
      // return JSON with error message
      res.json({ error: dateObj.toString() });
    } else {
      // return milliseconds and UTC date/time string
      res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() });
    }
  } else {
    // Construct date object with current date/time 
    const dateObj = new Date();
    // return millisec and UTC date/time string
    res.json({ unix: dateObj.getTime(), utc: dateObj.toUTCString() });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
