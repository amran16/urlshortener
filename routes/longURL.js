var express = require('express');
var router = express.Router();
var URL = require('../models/url');
var valid = require('url-valid');
var shortid = require('shortid');


router.get('/:url(*)', function(req, res, next) {
  var longUrl = req.params.url;

  valid(longUrl, function(err, isValid) {
    if (err) return next(err);
    if (!isValid) return res.send({ success: false, message: 'Your URL is not in a valid format' });

    URL.findOne({ original_url: longUrl }, function(err, url) {
      if (err) return next(err);
      if (!url) {
        URL.create({
          original_url: longUrl,
          short_url: shortid.generate()
        }, function(err, result) {
          if (err) return next(err);
          var short = 'https://maryamnumbertwo.herokuapp.com/' + result.short_url;
          var data = { original_url: result.original_url, short_url: short};
          res.send({ success: true, message: 'created new short url!', result: data});
        });
      } 
    });
  });
});

module.exports = router;
