'use strict';
var ware = require('ware');
var mixin = require('merge-descriptors');
var pathToRegexp = require('path-to-regexp');

var proto = {
    use: function() {
        var handlers = Array.prototype.slice.call(arguments);
        this.ware.use(handlers);

        return this;
    },

    _before: function(before) {
        this._beforeFn = before;
        return this;
    },

    _run: function(req, res, next) {
        var ctx = this;

        if (this._beforeFn) {
            this._beforeFn(req, res, function(err) {
                if (err) {
                    next(err);
                } else {
                    ctx.ware.run(req, res, next);
                }
            })
        } else {
            this.ware.run(req, res, next);
        }

        return this;
    },

    match: function(path) {
        this.matchResult = this.regexp.exec(path);

        return this.matchResult;
    },

    _getParamsValue: function() {
        var params = {};

        if (this.keys.length) {
            this.keys.forEach(function(key, i) {
                params[key.name] = this.matchResult[i + 1];
            }, this);
        }

        return params;
    }
}

function routeFactory(pattern) {
    var middleware = new ware();
    var route = function(req, res, next) {

        var match = route.match(req.path);

        if (match) {
            req.params = route._getParamsValue();
            route._run(req, res, next);
        } else {
            next();
        }
    }

    route.ware = middleware;
    route.keys = [];
    route.pattern = pattern;
    route.regexp = pathToRegexp(route.pattern, route.keys);

    mixin(route, proto, false);
    return route;
}


module.exports = routeFactory;