var express = require('express'),
    mongoose = require('mongoose'),
    valid = require('url-valid'),
    shortid = require('shortid'),
    path = require('path');

var longRoutes = require('./routes/longURL'),
    shortRoutes = require('./routes/shortURL');

var  app = express();

//set the heroku config variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url_shortner');

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use("/", shortRoutes);
app.use("/new", longRoutes);

app.listen(process.env.PORT || 3000, function(){
      console.log("Server running on port 3000");
  });
