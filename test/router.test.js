'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var routerFactory = require('../lib/router');

describe('Router', function() {
  describe('#use', function() {
    it('should run handler without path', function() {
      var router = routerFactory();
      var spy = sinon.spy();

      router.use(function() {
        spy();
      });

      router({
        url: 'any'
      }, {});

      spy.calledOnce.should.be.ok;
    });

    it('should run several handlers without path', function() {
      var router = routerFactory();
      var spy = sinon.spy();

      router.use(function(req, res, next) {
        spy();
        next();
      }, function(req, res, next) {
        spy();
        next();
      }, function() {
        spy();
      });

      router({
        url: 'any'
      }, {}, function() {});

      spy.calledThrice.should.be.ok;
    });

    it('should run next handler only if next() called', function() {
      var router = routerFactory();
      var spy = sinon.spy();

      router.use(function(req, res, next) {
        spy();
        next();
      }, function(req, res, next) {
        spy();
      }, function() {
        spy();
      });

      router({
        url: 'any'
      }, {}, function() {});

      spy.calledTwice.should.be.ok;
    });



    it('should run handlers for path', function() {
      var router = routerFactory();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      router.get('/test1', function(req, res, next) {
        spy1();
        next();
      }, function() {
        spy1();
      });

      router.get('/test2', function(req, res, next) {
        spy2();
        next();
      }, function() {
        spy2();
      });

      router.get('/test3', function(req, res, next) {
        spy3();
        next();
      }, function() {
        spy3();
      });

      router({
        url: 'http://localhost/test2'
      }, {}, function() {});

      spy1.called.should.be.false;
      spy2.calledTwice.should.be.ok;
      spy3.called.should.be.false;
    });

    it('can mount another router', function(done) {
      var router = routerFactory();
      var router2 = routerFactory();
      var router3 = routerFactory();

      router3.use('/test33', function() {
        done();
      });
      router2.use('/test22', router3);

      router.use('/test11', router2);

      router({
        url: 'http://localhost/test11/test22/test33'
      }, {}, function() {});

    });


  });

  describe('error middleware', function() {
    it('should catch next(error)', function() {
      var router = routerFactory();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      router.get('/error', function(req, res, next) {
        spy1();
        next(new Error('error in route'));
      }, function(req, res, next) {
        spy1();
      });

      router.use(function(err, req, res, next) {
        spy2();
      });

      router({
        url: 'http://localhost/error'
      }, {}, function() {});

      spy1.calledOnce.should.be.ok;
      spy2.calledOnce.should.be.ok;
    });

    it('should catch thrown error', function() {
      var router = routerFactory();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();

      router.get('/error', function(req, res, next) {
        spy1();
        throw new Error('error in route');
      }, function(req, res, next) {
        spy1();
      });

      router.use(function(err, req, res, next) {
        spy2();
      });

      router({
        url: 'http://localhost/error'
      }, {}, function() {});

      spy1.calledOnce.should.be.ok;
      spy2.calledOnce.should.be.ok;
    });

    it('can pass error to next error middleware', function() {
      var router = routerFactory();
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();

      router.get('/error', function(req, res, next) {
        spy1();
        throw new Error('error in route');
      }, function(req, res, next) {
        spy1();
      });

      router.use(function(err, req, res, next) {
        spy2();
        next(err);
      });
      router.use(function(err, req, res, next) {
        spy3();
      });


      router({
        url: 'http://localhost/error'
      }, {}, function() {});

      spy1.calledOnce.should.be.ok;
      spy2.calledOnce.should.be.ok;
      spy2.calledOnce.should.be.ok;
    });

  });

  it('should get query string parameters', function(done) {
    var router = routerFactory();

    router.use('/test', function(req, res, next) {
      req.query.one.should.to.equal('1');
      req.query.two.should.to.equal('2');
      done();
    });

    router({
      url: 'http://localhost/test?one=1&two=2'
    }, {}, function() {});
  });

  it('should get route parameters', function(done) {
    var router = routerFactory();

    router.use('/test/:one/:two', function(req, res, next) {
      req.params.one.should.to.equal('foo');
      req.params.two.should.to.equal('bar');
      done();
    });

    router({
      url: 'http://localhost/test/foo/bar'
    }, {}, function() {});
  })

});
