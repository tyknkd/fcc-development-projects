require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4/24344756#24344756
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Connect to database
const URI = process.env['MONGO_URI'];
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// Define DB schema
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: Number, required: true, unique: true }
});

// Define model
const urlModel = mongoose.model('Url', urlSchema);

// Handle post requests
app.post('/api/shorturl', (req, res) => {
  // Get URL from body
  const url = req.body.url;
  // Define regex for valid URL format: begins with http:// or https://
  // followed by alphanumeric string (including hyphen and underscore)
  // followed by at least one decimal and alphanumeric string and
  // optionally followed by slashes, question marks, equal signs, 
  // hyphens, and alphanumeric strings
  // e.g., "https://urlshortener-project.tyknkd.repl.co/?v=1698212934324"
  const regex = /^https?:\/\/\w+[-\w]*\.\w+[-\w]*(\.\w+[-\w]*)*(\/[?]*[=-\w]*)*/;
  // If not valid URL format
  if (!regex.test(url)) {
    // return error
    res.json({ error: 'invalid url' });
  } else {
    // Lookup URL
    urlModel.findOne({ original_url: url }, (err, existing_entry) => {
      // If error, log to console
      if (err) { console.error(err) }
      // If URL exists in database
      else if (existing_entry) {
        // Return original and short URL as JSON
        res.json({
          original_url: existing_entry.original_url,
          short_url: existing_entry.short_url
        });
      } else {
        // Get largest short URL in database
        let next_short_url = 1;
        urlModel.find({}).sort({ short_url: 'desc' }).limit(1)
        .exec((err, previous_entry) => {
          // If error, log to console
          if (err) { console.error(err) }
          // If shortUrl exists in database           
          else if (previous_entry.length > 0) {
            // Set new short URL to last short URL + 1
            next_short_url = (Number(previous_entry[0].short_url) + 1);
          }
          // Save URL to database
          urlModel.create({
            original_url: url,
            short_url: next_short_url
          }, (err, new_entry) => {
            // If error, log to console
            if (err) { console.error(err) }
            else {
              // Return original and new short URL as JSON
              res.json({
                original_url: new_entry.original_url,
                short_url: new_entry.short_url
              });
            }
          });
        });
      }
    });
  }
});

// Handle get requests
app.get('/api/shorturl/:short_url', (req, res) => {
  // Get short_url from params 
  const short_url = req.params.short_url;
  // Redirect to original URL via DB lookup
  urlModel.findOne({ short_url: short_url }, (err, data) => {
    if (err) { res.json({ error: 'invalid short url' }) }
    else { res.redirect(data.original_url); }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
