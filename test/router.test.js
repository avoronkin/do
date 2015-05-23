'use strict';

var should = require('chai').should();
var sinon = require('sinon');
var routerFactory = require('../lib/router');

describe('Router', function() {
  describe('#use', function() {
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


  // describe('#param', function() {
  //   it('should call param function when routing middleware', function(done) {
  //     var req = {
  //       url: 'http://localhost/foo/123/bar'
  //     };
  //     var router = routerFactory();
  //     var spy = sinon.spy();

  //     router.param('id', function(req, res, next, id) {
  //       // id.should.equal('123');
  //       console.log('pppppppppppppp')
  //         // spy();
  //         // next();
  //     });

  //     router.use('/foo/:id/bar', function(req, res, next) {
  //       // req.params.id.should.equal('123');
  //       next();
  //     });

  //     router(req, {}, function(err) {
  //       // spy.calledOnce.should.be.ok;
  //       done();
  //     });
  //   });


  //   it('should only call once per request', function(done) {
  //     var count = 0;
  //     var req = {
  //       url: 'http://localhost/foo/bob/bar'
  //     };
  //     var router = routerFactory();
  //     var spy = sinon.spy();

  //     router.param('user', function(req, res, next, user) {
  //       req.user = user;
  //       console.log('user params', user)
  //       spy();
  //       next();
  //     });

  //     router.use('/foo/:user/bar', function(req, res, next) {
  //       console.log('user route 1');
  //       next();
  //     });

  //     router.use('/foo/:user/bar', function(req, res, next) {
  //       console.log('user route 2');
  //     });

  //     router(req, {}, function(err) {
  //       if (err) return done(err);
  //       console.log('done', router._paramsCalled);
  //       spy.calledOnce.should.be.ok;
  //       // req.user.should.equal('bob');
  //       done();
  //     });
  //   });


  // });

});
