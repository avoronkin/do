'use strict';

var ware = require('ware');
var pathToRegexp = require('path-to-regexp');
var parseUrl = require('url-parse');
var mixin = require('merge-descriptors');
var routeFactory = require('./route');

var proto = {
  use: function(path) {
    var noPath = ('string' !== typeof path);
    path = (noPath ? '(.*)' : path);
    var argumentsOffset = noPath ? 0 : 1;
    var handlers = Array.prototype.slice.call(arguments, argumentsOffset);

    // if (handlers.length === 1 && handlers[0].ware) { //if mount another router
    //   handlers[0].ware.fns.forEach(function(fn, index) {
    //     fn._filter = path + fn._filter
    //     this.ware.use(fn);
    //   }, this);
    // } else {
    var route = routeFactory(path)
      ._before(this.paramWare.run.bind(this.paramWare))
      .use(handlers);

    this.ware.use(route);
    // }


  },

  param: function(name, fn) {
    if (Array.isArray(name)) {
      name.forEach(function(name) {
        this.addParam(name, fn);
      }, this);
    } else {
      this.addParam(name, fn);
    }
  },

  addParam: function(name, fn) {
    this.paramWare.use(function(req, res, next) {
      if (req.params[name]) {
        fn(req, res, next, req.params[name]);
      } else {
        next()
      }
    });
  }
};

function routerFactory() {
  var middleware = new ware();
  var paramWare = new ware();
  var router = function(req, res, next) {
    var parsedUrl = parseUrl(req.url);
    req.path = parsedUrl.pathname;
    req.query = parsedUrl.query

    middleware.run(req, res, next);
  }

  router.ware = middleware;
  router.paramWare = paramWare;

  mixin(router, proto, false);

  router.keys = [];
  router.get = router.use;

  return router;
}

module.exports = routerFactory;