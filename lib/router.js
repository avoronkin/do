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
    // if (handlers.length === 1 && handlers[0].ware) {}
    this.ware.use(path, handlers);
  },

  _match: function(url, pattern) {
    this.keys = [];
    var regexp = pathToRegexp(this.mountpath + pattern, this.keys);
    this.parsedUrl = parseUrl(url, true);

    var result = regexp.exec(this.parsedUrl.pathname);

    return result;
  }
};

function routerFactory() {
  var middleware = ware();

  var router = function(req, res, next) {
    middleware.run(req, res, next);
  }

  router.ware = middleware;

  router.ware.filter(function(pattern, req, res) {
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

  router.mountpath = '';
  router.keys = [];
  router.get = router.use;

  return router;
}

module.exports = routerFactory;
