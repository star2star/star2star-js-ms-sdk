"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.object.get-own-property-descriptor.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.get-own-property-descriptors.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.array.slice.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger = /*#__PURE__*/function () {
  function Logger() {
    _classCallCheck(this, Logger);

    var prettyPrint = process.env.MS_LOGPRETTY ? process.env.MS_LOGPRETTY : "false";

    var _require = require('winston'),
        createLogger = _require.createLogger,
        format = _require.format,
        transports = _require.transports;

    var combine = format.combine,
        timestamp = format.timestamp,
        label = format.label,
        printf = format.printf;
    var theFormat = printf(function (_ref) {
      var level = _ref.level,
          message = _ref.message,
          meta = _ref.meta,
          label = _ref.label,
          timestamp = _ref.timestamp;
      var loggerID;
      var loggerTrace;
      var loggerParent;
      var loggedMessageJSON = {};

      if (meta && meta.hasOwnProperty('id')) {
        loggerID = meta.id;
        delete meta.id;
      }

      if (meta && meta.hasOwnProperty('trace')) {
        loggerTrace = meta.trace;
        delete meta.trace;
      }

      if (meta && meta.hasOwnProperty('parent')) {
        loggerParent = meta.parent;
        delete meta.parent;
      } //stipping bearer tokens from logs for security


      if (meta && meta.hasOwnProperty("Authorization")) {
        delete meta.Authorization;
      }

      loggedMessageJSON.level = level;
      loggedMessageJSON.message = message;
      loggedMessageJSON.application = label;
      loggedMessageJSON.timestamp = timestamp;

      if (meta && JSON.stringify(meta) !== '{}') {
        loggedMessageJSON.metadata = meta;
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

      if (prettyPrint === "true") {
        return JSON.stringify(loggedMessageJSON, null, "\t");
      } else {
        return JSON.stringify(loggedMessageJSON);
      }
    });
    this.logger = createLogger({
      format: combine(label({
        label: 's2sMsSDK'
      }), timestamp(), theFormat),
      //RFC5424
      levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
      },
      transports: [new transports.Console({
        level: process.env.MS_LOGLEVEL ? process.env.MS_LOGLEVEL : "info"
      })]
    });
    return this;
  } //This function takes in an arguments object. It will serperatie out the first argument given. The first argument provided is the message title.


  _createClass(Logger, [{
    key: "getMessage",
    value: function getMessage(a) {
      return a && a.length > 0 ? a[0] : "default message";
    } //This function takes in an arguments object.
    //It will use these arguments to determine what the metadata is.

  }, {
    key: "getMeta",
    value: function getMeta(a) {
      var meta; //If there is only 1 argument that mean no metadata was passed in.

      if (a && a.length > 1) {
        //this code will run the splice and reduce functions on the arguments object as if it was an array
        //This code will add a new attribute to an empty object. This attribute will have the index of the argument as its' key.
        meta = [].slice.call(a, 1).reduce(function (p, c, i) {
          if (_typeof(c) === 'object') {
            p = _objectSpread(_objectSpread({}, p), c);
          } else {
            p[i] = c;
          }

          return p;
        }, {});
      }

      return meta;
    }
  }, {
    key: "emerg",
    value: function emerg() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('emerg', msg, meta);
    }
  }, {
    key: "alert",
    value: function alert() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('alert', msg, meta);
    }
  }, {
    key: "crit",
    value: function crit() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('crit', msg, meta);
    }
  }, {
    key: "error",
    value: function error() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('error', msg, meta);
    }
  }, {
    key: "warning",
    value: function warning() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('warning', msg, meta);
    }
  }, {
    key: "notice",
    value: function notice() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('notice', msg, meta);
    }
  }, {
    key: "info",
    value: function info() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('info', msg, meta);
    }
  }, {
    key: "debug",
    value: function debug() {
      var msg = this.getMessage(arguments);
      var meta = this.getMeta(arguments);
      this.log('debug', msg, meta);
    }
  }, {
    key: "log",
    value: function log(aLevel, aMsg, aMeta) {
      var newLevel = aLevel;
      var newMeta = aMeta ? aMeta : {};
      newMeta.level = aLevel; //If the meta data has the property debug set as true the level of the log will be changed to debug

      if (aMeta && aMeta.hasOwnProperty('debug') && aMeta.debug === true) {
        newLevel = 'alert';
      }

      this.logger.log(newLevel, aMsg, {
        "meta": aMeta
      });
    }
  }]);

  return Logger;
}();

exports.default = Logger;