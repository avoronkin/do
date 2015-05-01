'use strict';

// var expect = require('chai').expect;
var should = require('chai').should();
var routeFactory = require('../lib/route');



describe('Route', function() {

  it('should run handler', function(done) {
    var route = routeFactory('/test', function() {
      done();
    });

    route({
      url: 'http://localhost/test'
    }, {}, function() {});
  });

  it('should run multiple handlers', function(done) {
    var route = routeFactory('/multiple', function(req, res, next) {
      next();
    }, function(req, res, next) {
      next();
    }, function() {
      done();
    });

    route({
      url: 'http://localhost/multiple'
    }, {}, function() {});

  });

  it('should not run handler if the path does not match', function(done) {
    var route = routeFactory('/test2', function() {});

    route({
      url: 'http://localhost/test'
    }, {}, function(err) {
      done(err);
    });
  });

  it('shoud parse route params', function(done) {
    var route = routeFactory('/test/:id/:user', function(req) {
      req.params.id.should.equal('2');
      req.params.user.should.equal('username');
      done();
    });

    route({
      url: 'http://localhost/test/2/username?q=test&page=3'
    }, {}, function() {});

  });

  it('shoud parse query params', function(done) {
    var route = routeFactory('/search', function(req) {
      req.query.q.should.equal('test');
      req.query.page.should.equal('3');
      done();
    });

    route({
      url: 'http://localhost/search?q=test&page=3'
    }, {}, function() {});

  });

  it('should support regex', function(done) {
    var route = routeFactory('/search(.*)', function(req) {
      req.params['0'].should.equal('blabla');
      done();
    });

    route({
      url: 'http://localhost/searchblabla'
    }, {}, function() {});
  });


  // it('can mount another route', function(done) {
  //   var route1 = routeFactory('/route1/:id1', function() {});

  //   var route2 = routeFactory('/route2/:id2', function() {
  //     done();
  //   });

  //   route1.mount('', route2);

  //   route2({
  //     url: 'http://localhost/route1/45/route2/898'
  //   }, {}, function() {});
  // });


});
