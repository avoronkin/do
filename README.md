[![Build Status](https://travis-ci.org/avoronkin/xpres.svg?branch=master)](https://travis-ci.org/avoronkin/do)

```javascript
'use strict';

var routerFactory = require('xpres').Router;
var Server = require('xpres').Server;

var router = routerFactory();

router.use(function(req, res, next) {
  console.log('middleware');
  next();
});

router.get('/test', function(req, res, next) {
  console.log('/test');
});

router.use('/test3', function(req, res, next) {
  console.log('/test3 1');
  next();
}, function(req, res, next) {
  console.log('/test3 2');
});

router.use('/error', function(req, res, next) {
  console.log('/error');
  next(new Error('some error'));
});

router.use(function(req, res, next) {
  console.log('url not found!!!');
});

router.use(function(err, req, res, next) {
  console.log('ups!!! error handler', err);
});

var server = new Server(router);

document.addEventListener('DOMContentLoaded', function() {
  server.run();
}, false);
```
