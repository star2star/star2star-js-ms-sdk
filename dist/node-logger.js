'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var winston = require('winston');

var Logger = function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this.logger = new winston.Logger({
      levels: {
        error: 0,
        trace: 1,
        info: 2,
        debug: 3
      },
      transports: [new winston.transports.Console({
        level: 'trace',
        formatter: function formatter(options) {
          var loggerID = void 0;
          var loggerTrace = void 0;
          var loggerParent = void 0;
          var loggedMessageJSON = {};

          if (options.meta && options.meta.hasOwnProperty('id')) {
            loggerID = options.meta.id;
            delete options.meta.id;
          }

          if (options.meta && options.meta.hasOwnProperty('trace')) {
            loggerTrace = options.meta.trace;
            delete options.meta.trace;
          }

          if (options.meta && options.meta.hasOwnProperty('parent')) {
            loggerParent = options.meta.parent;
            delete options.meta.parent;
          }

          //stipping bearer tokens from logs for security
          if (options.meta && options.meta.hasOwnProperty("Authorization")) {
            delete options.meta.Authorization;
          }

          loggedMessageJSON.level = options.level;
          loggedMessageJSON.message = options.message;
          loggedMessageJSON.application = "s2sMsSDK";
          loggedMessageJSON.timestamp = new Date(Date.now()).toISOString();

          if (options.meta && JSON.stringify(options.meta) !== '{}') {
            loggedMessageJSON.metadata = options.meta;
          }

          if (loggerID) {
            loggedMessageJSON.id = loggerID;
          }
          if (loggerTrace) {
            loggedMessageJSON.trace = loggerTrace;
          }
          if (loggerParent) {
            loggedMessageJSON.parent = loggerParent;
          }

          if (this.prettyPrint) {
            return JSON.stringify(loggedMessageJSON, null, "\t");
          } else {
            return JSON.stringify(loggedMessageJSON);
          }
        }
      })]
    });
    return this;
  }

  _createClass(Logger, [{
    key: 'setLevel',
    value: function setLevel(aLevel) {
      var validatedLevel = void 0;
      switch (aLevel) {
        case "error":
        case "info":
        case "debug":
        case "trace":
          validatedLevel = aLevel;
          break;
        default:
          validatedLevel = "silent";
      }
      this.logger.transports.console.level = validatedLevel;
    }
  }, {
    key: 'setPretty',
    value: function setPretty(pretty) {
      if (pretty) {
        this.logger.transports.console.prettyPrint = true;
      } else {
        this.logger.transports.console.prettyPrint = false;
      }
    }

    //This function takes in an arguments object. It will serperatie out the first argument given. The first argument provided is the message title.

  }, {
    key: 'getMessage',
    value: function getMessage(a) {
      return a && a.length > 0 ? a[0] : "default message";
    }

    //This function takes in an arguments object.
    //It will use these arguments to determine what the metadata is.

  }, {
    key: 'getMeta',
    value: function getMeta(a) {
      var meta = void 0;
      //If there is only 1 argument that mean no metadata was passed in.

      if (a && a.length > 1) {
        //this code will run the splice and reduce functions on the arguments object as if it was an array
        //This code will add a new attribute to an empty object. This attribute will have the index of the argument as its' key.
        meta = [].slice.call(a, 1).reduce(function (p, c, i) {
          if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
            p = _extends({}, p, c);
          } else {
            p[i] = c;
          }

          return p;
        }, {});
      }
      return meta;
    }
  }, {
    key: 'error',
    value: function error() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);

      this.log('error', msg, meta);
    }
  }, {
    key: 'info',
    value: function info() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);

      this.log('info', msg, meta);
    }
  }, {
    key: 'debug',
    value: function debug() {

      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);

      this.log('debug', msg, meta);
    }
  }, {
    key: 'trace',
    value: function trace() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);

      this.log('trace', msg, meta);
    }
  }, {
    key: 'log',
    value: function log(aLevel, aMsg, aMeta) {
      var newLevel = aLevel;
      var newMeta = aMeta ? aMeta : {};
      newMeta.level = aLevel;
      //If the maeta data has the property debug set as true the level of the log will be changed to trace
      if (aMeta && aMeta.hasOwnProperty('debug') && aMeta.debug === true) {
        newLevel = 'trace';
      }
      this.logger.log(newLevel, aMsg, newMeta);
    }
  }]);

  return Logger;
}();

exports.default = Logger;