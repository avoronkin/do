'use strict';

var ware = require('filter-ware');
var pathToRegexp = require('path-to-regexp');
var parseUrl = require('url-parse');
var mixin = require('merge-descriptors');

var proto = {
  use: function(path) {
    var noPath = ('string' !== typeof path);
    path = (noPath ? '(.*)' : path);
    var argumentsOffset = noPath ? 0 : 1;
    var handlers = Array.prototype.slice.call(arguments, argumentsOffset);

    if (handlers.length === 1 && handlers[0].ware) { //if mount another router
      handlers[0].ware.fns.forEach(function(fn, index) {
        fn._filter = path + fn._filter
        this.ware.use(fn);
      }, this);
    } else {
      this.ware.use(path, handlers);
    }


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
    this.paramWare.use(name, function(req, res, next) {
      fn(req, res, next, req.params[name]);
    });
  },

  _match: function(url, pattern) {
    this.keys = [];
    var regexp = pathToRegexp(pattern, this.keys);
    this.parsedUrl = parseUrl(url, true);

    var result = regexp.exec(this.parsedUrl.pathname);

    return result;
  }
};

function routerFactory() {
  var middleware = new ware();
  var paramWare = new ware();
  var router = middleware.run.bind(middleware);

  router.ware = middleware;
  router.paramWare = paramWare;

  paramWare.filter(function(name, req, res) {
    return Object.keys(req.params).some(function(_name, index) {
      return name === _name;
    });
  });

  router.ware
    .before(paramWare.run.bind(paramWare))
    .filter(function(pattern, req, res) {
      var match = router._match(req.url, pattern);

      if (match) {
        req.query = router.parsedUrl.query;

        req.params = {};
        if (router.keys.length) {
          router.keys.forEach(function(key, i) {
            req.params[key.name] = match[i + 1];
          });
        }
      }

      return !!match;
    });

  mixin(router, proto, false);

  router.keys = [];
  router.get = router.use;

  return router;
}

module.exports = routerFactory;
