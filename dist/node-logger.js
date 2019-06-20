"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Logger {
  constructor() {
    const prettyPrint = process.env.MS_LOGPRETTY ? process.env.MS_LOGPRETTY : false;

    const _require = require('winston'),
          createLogger = _require.createLogger,
          format = _require.format,
          transports = _require.transports;

    const combine = format.combine,
          timestamp = format.timestamp,
          label = format.label,
          printf = format.printf;
    const theFormat = printf((_ref) => {
      let level = _ref.level,
          message = _ref.message,
          meta = _ref.meta,
          label = _ref.label,
          timestamp = _ref.timestamp;
      let loggerID;
      let loggerTrace;
      let loggerParent;
      let loggedMessageJSON = {};

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

      if (prettyPrint) {
        return JSON.stringify(loggedMessageJSON, null, "\t");
      } else {
        return JSON.stringify(loggedMessageJSON);
      }
    });
    this.logger = createLogger({
      format: combine(label({
        label: 's2sMsSDK'
      }), timestamp(), theFormat),
      transports: [new transports.Console({
        level: process.env.MS_LOGLEVEL ? process.env.MS_LOGLEVEL : "info",
        levels: {
          emerg: 0,
          alert: 1,
          crit: 2,
          error: 3,
          warning: 4,
          notice: 5,
          info: 6,
          debug: 7
        }
      })]
    });
    return this;
  } //This function takes in an arguments object. It will serperatie out the first argument given. The first argument provided is the message title.


  getMessage(a) {
    return a && a.length > 0 ? a[0] : "default message";
  } //This function takes in an arguments object.
  //It will use these arguments to determine what the metadata is.


  getMeta(a) {
    let meta; //If there is only 1 argument that mean no metadata was passed in.

    if (a && a.length > 1) {
      //this code will run the splice and reduce functions on the arguments object as if it was an array
      //This code will add a new attribute to an empty object. This attribute will have the index of the argument as its' key.
      meta = [].slice.call(a, 1).reduce((p, c, i) => {
        if (typeof c === 'object') {
          p = _objectSpread({}, p, c);
        } else {
          p[i] = c;
        }

        return p;
      }, {});
    }

    return meta;
  }

  emerg() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('emerg', msg, meta);
  }

  alert() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('alert', msg, meta);
  }

  crit() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('crit', msg, meta);
  }

  error() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('error', msg, meta);
  }

  warning() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('warning', msg, meta);
  }

  notice() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('notice', msg, meta);
  }

  info() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('info', msg, meta);
  }

  debug() {
    const msg = this.getMessage(arguments);
    const meta = this.getMeta(arguments);
    this.log('debug', msg, meta);
  }

  log(aLevel, aMsg, aMeta) {
    let newLevel = aLevel;
    let newMeta = aMeta ? aMeta : {};
    newMeta.level = aLevel; //If the meta data has the property debug set as true the level of the log will be changed to debug

    if (aMeta && aMeta.hasOwnProperty('debug') && aMeta.debug === true) {
      newLevel = 'debug';
    }

    this.logger.log(aLevel, aMsg, {
      "meta": aMeta
    });
  }

}

exports.default = Logger;