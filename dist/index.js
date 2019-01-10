/*global require process module*/
"use strict";

require("core-js/modules/es6.array.copy-within");

require("core-js/modules/es6.array.every");

require("core-js/modules/es6.array.fill");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.from");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.array.last-index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.of");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/es6.array.reduce-right");

require("core-js/modules/es6.array.some");

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.species");

require("core-js/modules/es6.date.now");

require("core-js/modules/es6.date.to-iso-string");

require("core-js/modules/es6.date.to-json");

require("core-js/modules/es6.date.to-primitive");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.has-instance");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.map");

require("core-js/modules/es6.math.acosh");

require("core-js/modules/es6.math.asinh");

require("core-js/modules/es6.math.atanh");

require("core-js/modules/es6.math.cbrt");

require("core-js/modules/es6.math.clz32");

require("core-js/modules/es6.math.cosh");

require("core-js/modules/es6.math.expm1");

require("core-js/modules/es6.math.fround");

require("core-js/modules/es6.math.hypot");

require("core-js/modules/es6.math.imul");

require("core-js/modules/es6.math.log1p");

require("core-js/modules/es6.math.log10");

require("core-js/modules/es6.math.log2");

require("core-js/modules/es6.math.sign");

require("core-js/modules/es6.math.sinh");

require("core-js/modules/es6.math.tanh");

require("core-js/modules/es6.math.trunc");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es6.number.epsilon");

require("core-js/modules/es6.number.is-finite");

require("core-js/modules/es6.number.is-integer");

require("core-js/modules/es6.number.is-nan");

require("core-js/modules/es6.number.is-safe-integer");

require("core-js/modules/es6.number.max-safe-integer");

require("core-js/modules/es6.number.min-safe-integer");

require("core-js/modules/es6.number.parse-float");

require("core-js/modules/es6.number.parse-int");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.object.create");

require("core-js/modules/es7.object.define-getter");

require("core-js/modules/es7.object.define-setter");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.define-properties");

require("core-js/modules/es7.object.entries");

require("core-js/modules/es6.object.freeze");

require("core-js/modules/es6.object.get-own-property-descriptor");

require("core-js/modules/es7.object.get-own-property-descriptors");

require("core-js/modules/es6.object.get-own-property-names");

require("core-js/modules/es6.object.get-prototype-of");

require("core-js/modules/es7.object.lookup-getter");

require("core-js/modules/es7.object.lookup-setter");

require("core-js/modules/es6.object.prevent-extensions");

require("core-js/modules/es6.object.is");

require("core-js/modules/es6.object.is-frozen");

require("core-js/modules/es6.object.is-sealed");

require("core-js/modules/es6.object.is-extensible");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.seal");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es7.object.values");

require("core-js/modules/es6.promise");

require("core-js/modules/es7.promise.finally");

require("core-js/modules/es6.reflect.apply");

require("core-js/modules/es6.reflect.construct");

require("core-js/modules/es6.reflect.define-property");

require("core-js/modules/es6.reflect.delete-property");

require("core-js/modules/es6.reflect.get");

require("core-js/modules/es6.reflect.get-own-property-descriptor");

require("core-js/modules/es6.reflect.get-prototype-of");

require("core-js/modules/es6.reflect.has");

require("core-js/modules/es6.reflect.is-extensible");

require("core-js/modules/es6.reflect.own-keys");

require("core-js/modules/es6.reflect.prevent-extensions");

require("core-js/modules/es6.reflect.set");

require("core-js/modules/es6.reflect.set-prototype-of");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.flags");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.search");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.set");

require("core-js/modules/es6.symbol");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.string.anchor");

require("core-js/modules/es6.string.big");

require("core-js/modules/es6.string.blink");

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.string.code-point-at");

require("core-js/modules/es6.string.ends-with");

require("core-js/modules/es6.string.fixed");

require("core-js/modules/es6.string.fontcolor");

require("core-js/modules/es6.string.fontsize");

require("core-js/modules/es6.string.from-code-point");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.string.italics");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.string.link");

require("core-js/modules/es7.string.pad-start");

require("core-js/modules/es7.string.pad-end");

require("core-js/modules/es6.string.raw");

require("core-js/modules/es6.string.repeat");

require("core-js/modules/es6.string.small");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/es6.string.strike");

require("core-js/modules/es6.string.sub");

require("core-js/modules/es6.string.sup");

require("core-js/modules/es6.string.trim");

require("core-js/modules/es6.typed.array-buffer");

require("core-js/modules/es6.typed.data-view");

require("core-js/modules/es6.typed.int8-array");

require("core-js/modules/es6.typed.uint8-array");

require("core-js/modules/es6.typed.uint8-clamped-array");

require("core-js/modules/es6.typed.int16-array");

require("core-js/modules/es6.typed.uint16-array");

require("core-js/modules/es6.typed.int32-array");

require("core-js/modules/es6.typed.uint32-array");

require("core-js/modules/es6.typed.float32-array");

require("core-js/modules/es6.typed.float64-array");

require("core-js/modules/es6.weak-map");

require("core-js/modules/es6.weak-set");

require("core-js/modules/web.timers");

require("core-js/modules/web.immediate");

require("core-js/modules/web.dom.iterable");

require("regenerator-runtime/runtime");

var Accounts = require("./accounts");

var Lambda = require("./lambda");

var Identity = require("./identity");

var Messaging = require("./messaging");

var Objects = require("./objects");

var Util = require("./utilities");

var Task = require("./task");

var Groups = require("./groups");

var ShortUrls = require("./shorturls");

var Auth = require("./auth");

var Chat = require("./chat");

var Contacts = require("./contacts");

var Oauth = require("./oauth");

var Media = require("./media");

var Pubsub = require("./pubsub");

var Workflow = require("./workflow");

var Email = require("./email");

var ResourceGroups = require("./resourceGroups");

var Scheduler = require("./scheduler");

var cpaasKey;
/**
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas.star2star.com/api"] - valid url for microservice host server
 */

var setMsHost = function setMsHost() {
  var msHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://cpaas.star2star.com/api";
  Util.isBrowser() ? window.s2sJsMsSdk.MS_HOST = msHost : process.env.MS_HOST = msHost;
};
/**
 * 
 * @description This function sets the microservice target authentication host (AUTH_HOST) variable.
 * @param {string} [msHost="https://auth.star2starglobal.net"] - valid url for microservice host server
 */


var setMsAuthHost = function setMsAuthHost() {
  var authHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://auth.star2starglobal.net";
  Util.isBrowser() ? window.s2sJsMsSdk.AUTH_HOST = authHost : process.env.AUTH_HOST = authHost;
};
/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */


var setMSVersion = function setMSVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "v1";
  Util.isBrowser() ? window.s2sJsMsSdk.MS_VERSION = version : process.env.MS_VERSION = version;
};
/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */


var getMsHost = function getMsHost() {
  return Util.isBrowser() ? window.s2sJsMsSdk.MS_HOST : process.env.MS_HOST;
};
/**
 *
 *@description This function sets the application key.
 * @param {string} [key="missing"] - valid cpaas application key
 */


var setApplicationKey = function setApplicationKey() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "missing";
  cpaasKey = key;
};
/**
 *
 * @description This function returns the previously set app key.
 * @returns {string} - app key
 */


var getApplicationKey = function getApplicationKey() {
  return cpaasKey;
};
/**
 *
 * @description This function sets the environment; development, production, etc...
 * @param {string} env
 */


var setEnv = function setEnv(env) {
  Util.isBrowser() ? window.s2sJsMsSdk.MS_ENV = env : process.env.MS_ENV = env;
};
/**
 *
 * @description - This function retreives the currently configured environment; development, production, etc...
 * @returns {string} - environment.
 */


var getEnv = function getEnv() {
  var client;
  Util.isBrowser() ? client = window.s2sJsMsSdk : client = process.env;

  if (!client.hasOwnProperty("MS_ENV")) {
    setEnv(Util.config.env);
  }

  return client.MS_ENV;
};

module.exports = {
  Accounts: Accounts,
  Lambda: Lambda,
  Identity: Identity,
  Messaging: Messaging,
  Objects: Objects,
  Util: Util,
  Task: Task,
  setMsHost: setMsHost,
  getMsHost: getMsHost,
  setMsAuthHost: setMsAuthHost,
  setApplicationKey: setApplicationKey,
  getApplicationKey: getApplicationKey,
  setEnv: setEnv,
  getEnv: getEnv,
  Groups: Groups,
  ShortUrls: ShortUrls,
  Auth: Auth,
  Oauth: Oauth,
  Chat: Chat,
  Contacts: Contacts,
  Media: Media,
  Pubsub: Pubsub,
  setMSVersion: setMSVersion,
  Workflow: Workflow,
  Email: Email,
  ResourceGroups: ResourceGroups,
  Scheduler: Scheduler
};