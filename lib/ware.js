'use strict';

var ware = require('ware');

ware.prototype.getNext = function(params) {
  var err = params.err;
  var done = params.done;
  var fn = params.fn;
  var arr = params.arr;
  var ctx = params.ctx;
  var next = params.next;
  var wrap = params.wrap;
  var fail = params.fail;

  if (fn) {
    if (err) {
      if (fn.length === arr.length + 2) { //if fn is error middleware
        arr.unshift(err);
      } else {
        return next(err);
      }
    }

    return wrap(fn, next).apply(ctx, arr);
  } else {
    return (done && done.apply(null, [err].concat(arr))) || (err && fail(err));
  }
};


module.exports = ware;
