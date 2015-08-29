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


    }
};

function routerFactory() {
    var middleware = ware();

    middleware.filter(function(pattern, req, res) {
        var keys = [];
        var parsedUrl = parseUrl(req.url, true);
        var regexp = pathToRegexp(pattern, keys);
        var match  = regexp.exec(parsedUrl.pathname);

        if (match) {
            req.query = parsedUrl.query;
            req.params = {};

            if (keys.length) {
                keys.forEach(function(key, i) {
                    req.params[key.name] = match[i + 1];
                });
            }
        }

        return !!match;
    });

    var router = middleware.run.bind(middleware);
    router.ware = middleware;

    mixin(router, proto, false);
    router.get = router.use;

    return router;
}

module.exports = routerFactory;
