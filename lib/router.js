'use strict';

var debug = require('debug')('do:router');
var ware = require('ware');
var mixin = require('merge-descriptors');
var routeFactory = require('./route');


var proto = {
  use: function(path) {
    var noPath = ('string' !== typeof path);
    var argumentsOffset = noPath ? 0 : 1;
    var handlers = Array.prototype.slice.call(arguments, argumentsOffset);
    path = (noPath ? '(.*)' : path);

    if (handlers.length === 1) {
      handlers = handlers[0];
    }

    this.addHandler(path, handlers);
  },

  param: function(name, fn) {
    this._paramsCalled[name] = false;
    (this._params[name] = this._params[name] || []).push(fn);
  },

  addHandler: function(path, handler) {
    path = this.getPath() + path;
    var middleware;

    if (handler.isRouter) {
      middleware = handler;
      middleware.mountpath = path;
    } else {
      middleware = routeFactory(path, handler);
    }

    middleware.parent = this;

    this.ware.use.call(this.ware, middleware);
  },

  getPath: function() {
    var path = this.parent ? this.parent.getPath() + this.mountpath : '';
    return path;
  }
};

function routerFactory() {
  var middleware = ware();
  var router = function(req, res, next) {
    middleware.run(req, res, next);
  };

  router.ware = middleware;

  mixin(router, proto, false);

  router.mountpath = '';

  router.get = router.use;

  router._params = {};
  router._paramsCalled = {};

  router.isRouter = true;

  return router;
}

module.exports = routerFactory;
