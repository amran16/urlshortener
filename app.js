var express = require('express');
var mongoose = require('mongoose');
var valid = require('url-valid');
var shortid = require('shortid');
var path = require('path');

var app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url_shortner');

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define Schema
var urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
});

var Site = mongoose.model('URL', urlSchema);

// Routes
app.get('/', function(req, res, next) {
    res.render('index');
});

app.get('/new/:url(*)', function(req, res, next) {
  var longUrl = req.params.url;

  valid(longUrl, function(err, isValid) {
    if (err) return next(err);
    if (!isValid) return res.send({ success: false, message: 'Your URL is not in a valid format' });

    Site.findOne({ original_url: longUrl }, function(err, url) {
      if (err) return next(err);
      if (!url) {
        Site.create({
          original_url: longUrl,
          short_url: shortid.generate()
        }, function(err, result) {
          if (err) return next(err);
          res.send({ success: true, message: 'created new short url!', result: result });
        });
      } else {
        res.send({ success: true, message: 'found existing record', result: url });
      }
    });
  });
});

app.get('/:short', function(req, res, next) {
  var short = req.params.short;

  Site.findOne({ short_url: short }, function(err, answer) {
    if(err) return next(err);
    if (!answer) {
      return res.send({ success: false, message: 'this short code does not exist' });
    }
    res.redirect(answer.original_url);
  });
});


app.listen(3000, function() {
    console.log("Server running on port 3000");
});
