'use strict';
require('html5-history-api');
var debug = require('debug')('do:server');
var location = window.history.location || window.location;

function onClick(callback) {
  (function(eventInfo) {
    // hang on the event, all references in this document
    document[eventInfo[0]](eventInfo[1] + 'click', function(event) {
      event = event || window.event;
      var el = event.target || event.srcElement;

      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        return;
      }

      // ensure link
      if (!el || 'A' !== el.nodeName) {
        return;
      }

      // Ignore if tag has
      // 1. "download" attribute
      // 2. rel="external" attribute
      if (el.getAttribute('download') || el.getAttribute('rel') === 'external') {
        return;
      }

      // Check for mailto: in the href
      if (el.href && el.href.indexOf('mailto:') > -1) {
        return;
      }

      // check target
      if (el.target) {
        return;
      }

      // do not give a default action
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      callback(el.href);

    }, false);

  })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);

}

function onStateChange(callback) {
  var pushState = window.history.pushState;
  window.history.pushState = function() {
    pushState.apply(window.history, arguments);

    if (typeof window.history.onpushstate === 'function') {
      window.history.onpushstate.apply(window.history, arguments);
    }
  };

  (function(eventInfo) {
    // hang on popstate event triggered by pressing back/forward in browser
    window[eventInfo[0]](eventInfo[1] + 'popstate', function() {
      callback(location.href);
    }, false);

  })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);


  window.history.onpushstate = function onpushstate() {
    callback(location.href);
  };
}

var Server = function(callback) {
  this.callback = callback;
};

Server.prototype.run = function run() {
  var _this = this;

  onClick(function(url) {
    history.pushState(null, null, url);
  });

  onStateChange(function(url) {
    var request = {
      url: url
    };
    var responce = {};
    console.log('main app', _this.callback);

    _this.callback(request, responce);
  });
};

module.exports = Server;
