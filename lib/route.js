'use strict';

var debug = require('debug')('do:route');
var mixin = require('merge-descriptors');
var pathToRegexp = require('path-to-regexp');
var parseUrl = require('url-parse');
var ware = require('ware');

var proto = {
  match: function(url) {
    var pattern = this.getPath();

    //create regex from route pattern
    var regexp = pathToRegexp(pattern, this.keys);

    this.parsedUrl = parseUrl(url, true);

    var result = regexp.exec(this.parsedUrl.pathname);

    return result;
  },

  getParams: function(result) {
    var params = {};

    if (!!result && this.keys.length) {
      this.keys.forEach(function(key, i) {
        params[key.name] = result[i + 1];
      });
    }

    return params;
  },

  getPath: function() {
    var pattern = (this.parent ? this.parent.getPath() + this.mountpath : '') + this.pattern;
    return pattern;
  },

  // mount: function(path, route) {
  //   route.parent = this;
  //   route.mountpath = path;
  // }
};

function routeFactory(pattern) {
  var handlers = Array.prototype.slice.call(arguments, 1);

  var route = function(req, res, next) {
    var result = route.match(req.url);

    //if url matches
    if (!!result) {
      req.query = route.parsedUrl.query;
      req.params = route.getParams(result);

      //run handlers
      ware().use(handlers).run(req, res, function(err) {
        if (err) {
          next(err);
        }
      });

    } else {
      next();
    }
  };

  route.pattern = pattern;
  route.keys = [];
  route.params = {};
  route.query = {};
  route.parent = null;
  route.mountpath = '';

  mixin(route, proto, false);

  return route;
}

module.exports = routeFactory;
