'use strict';

var routerFactory = require('../../index.js').Router;
var Server = require('../../index.js').Server;

var router = routerFactory();

router.use(function(req, res, next) {
  console.log('middleware works!!!');
  next();
});

router.get('/basic/test', function(req, res, next) {
  console.log('route /basic/test works!');
});

router.use('/basic/test2', function(req, res, next) {
  console.log('route /basic/test2 works!');
});

router.use('/basic/test3', function(req, res, next) {
  console.log('route /basic/test3 works!');
  next();
}, function(req, res, next) {
  console.log('route /basic/test3 works 2!');
});

router.use(function(req, res, next) {
  console.log('url not found!!!');
});

var server = new Server(router);

document.addEventListener('DOMContentLoaded', function() {
  server.run();
}, false);
