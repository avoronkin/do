'use strict';

var express = require('express');
var browserify = require('browserify-middleware');
var join = require('path').join;
var fs = require('fs');

var app = express();
app.set('views', __dirname);
app.set('view engine', 'jade');
app.enable('strict routing');

var examples = fs.readdirSync(__dirname).filter(function(file) {
  return fs.statSync(__dirname + '/' + file).isDirectory();
});

app.get('/', function(req, res) {
  res.render('list', {
    examples: examples
  });
});

app.get('/:example', function(req, res) {
  res.redirect('/' + req.params.example + '/');
});

app.get('/:example/main.js', function(req, res, next) {
  var name = req.params.example;
  var path = join(__dirname, name);

  browserify(path + '/main.js')(req, res, next);
});

app.get('/:example/*', function(req, res) {
  var name = req.params.example;
  res.render(join(__dirname, name, 'index.jade'), {
    title: name
  });
});

app.listen(4000);
console.log('Example server listening on port 4000');
