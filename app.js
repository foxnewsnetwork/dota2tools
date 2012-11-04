
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , https = require('https')
  , Url = require('url')
  , querystring = require('querystring');

var app = express();
var WebApiKey = "4E95C36086BC4CC0F5B4D4F904AA74C7";
var Dota2Url = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=" + WebApiKey;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/dota2', function(req, res) {
  var url = Dota2Url + "&" + querystring.encode(req.query);
  https.get(url, function(json) {
    json.setEncoding("utf8");
    json.on('data', function(data) {
      result = JSON.parse(data)
      if(result == {}) {
        res.json(500, {error: "sorry"});
      }
      else {
        res.json(result);  
      }
      
    });
  });
}); 

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
