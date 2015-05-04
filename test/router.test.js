'use strict';

var should = require('chai').should();
var routerFactory = require('../lib/router');

describe('Router', function() {
  it('should run handler without path', function(done) {
    var router = routerFactory();

    router.use(function() {
      done();
    });

    router({
      url: 'any'
    }, {}, function() {});

  });

  it('should run several handlers without path', function(done) {
    var router = routerFactory();

    router.use(function(req, res, next) {
      next();
    }, function() {
      done();
    });

    router({
      url: 'any'
    }, {}, function() {});

  });



  it('should run handlers for path', function(done) {
    var router = routerFactory();


    router.get('/test1', function(req, res, next) {
      next();
    }, function() {});

    router.get('/test2', function(req, res, next) {
      next();
    }, function() {
      done();
    });

    router.get('/test3', function(req, res, next) {
      next();
    }, function() {});

    router({
      url: 'http://localhost/test2'
    }, {}, function() {});

  });


  it('can mount another router', function(done) {
    var router = routerFactory();
    var router2 = routerFactory();
    router2.use('/test22', function() {
      done();
    });

    router.use('/test11', router2);

    router({
      url: 'http://localhost/test11/test22'
    }, {}, function() {});

  });

  it('error middleware', function(done) {
    var router = routerFactory();

    router.get('/error', function(req, res, next) {
      next(new Error('error in route'));
    });

    router.use(function(err, req, res, next) {
      done();
    });

    router({
      url: 'http://localhost/error'
    }, {}, function() {});

  });

});
