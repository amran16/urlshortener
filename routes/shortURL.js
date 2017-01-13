var express = require('express');
var router = express.Router();
var URL = require('../models/url');


//root route (Home Page)
router.get('/', function(req, res){
    res.render('index');
});


//short route
router.get('/:short', function(req, res, next) {
  var short = req.params.short;

  URL.findOne({ short_url: short }, function(err, answer) {
    if(err) return next(err);
    if (!answer) {
      return res.send({ success: false, message: 'this short code does not exist' });
    }
    res.redirect(answer.original_url);
  });
});


module.exports = router;
