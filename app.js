var express = require('express'),
    mongoose = require('mongoose'),
    valid = require('url-valid'),
    shortid = require('shortid'),
    path = require('path'),
    app = express();

//set the heroku config variable
 mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url_shortner');

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


var urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: String
});

var Site = mongoose.model('URL', urlSchema);

app.get('/', function(req, res){
    res.render('index');
});

app.get('/new/:url(*)', function(req, res, next){
  var longUrl = req.params.url;
   //console.log(longUrl);

  valid(longUrl, function(err, valid){
     if(err){
       res.send('Nope, enter a valid site')
     }else if(valid === false) {
       res.send('Wrong format: ');
     }else if(valid === true){
        //res.send('good choice, your url is: ' + longUrl);
       Site.findOne({original_url: longUrl}, function(err, url){
         if(err){
           console.log(err);
         }else if(url === null){
           //res.send('Could not find any: ' + url);
           Site.create({
             original_url: longUrl,
             short_url: shortid.generate()
           }, function(err, result){
              if(err){
                console.log(err);
              }else{
                console.log('It is working');
                var data = {original_url: result.original_url, short_url: result.short_url};
                console.log(result);
              }
              res.json(data);
           });
         }
       });
     }
  });
});

app.get('/:short', function(req, res, next){
    var short = req.params.short;

    Site.findOne({short_url: short}, function(err, answer){
      //console.log(answer);
      if(err){
        res.send('Try again!')
      }else if(answer !== null) {
        res.redirect(answer.original_url);
      }
    });
  });


  app.listen(process.env.PORT || 3000, function(){
      console.log("Server running on port 3000");
  });
