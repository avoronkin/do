'use strict';

var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var debug = require('debug')('app:server');

<<<<<<< HEAD
//serve static files
app.use(serveStatic('dist'));

//serve index.html for all routes
=======
// //serve static files
app.use(serveStatic('dist'));

// //serve index.html for all routes
>>>>>>> e7d0db6f65e60920142989dbc3a97742abaabef8
app.all('/*', function(req, res) {
  res.sendFile('index.html', {
    root: 'dist'
  });
});

//start server
var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  debug('App listening at http://%s:%s', host, port);
});