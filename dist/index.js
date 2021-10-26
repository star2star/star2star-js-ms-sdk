/*global require process module*/
"use strict";

var Accounts = require("./accounts");

var Lambda = require("./lambda");

var Identity = require("./identity");

var Messaging = require("./messaging");

var Objects = require("./objects");

var Util = require("./utilities");

var Groups = require("./groups");

var ShortUrls = require("./shorturls");

var Auth = require("./auth");

var Chat = require("./chat");

var Contacts = require("./contacts");

var Oauth = require("./oauth");

var Media = require("./media");

var Providers = require("./providers");

var Pubsub = require("./pubsub");

var Workflow = require("./workflow");

var Email = require("./email");

var ResourceGroups = require("./resourceGroups");

var Scheduler = require("./scheduler");

var Metadata = require("./metadata");

var Mobile = require("./mobile");

var Forms = require("./forms");

var Entitlements = require("./entitlements");

var Activity = require("./activity");

var Resources = require("./resources");

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
  Providers: Providers,
  Pubsub: Pubsub,
  setMSVersion: setMSVersion,
  Workflow: Workflow,
  Email: Email,
  ResourceGroups: ResourceGroups,
  Scheduler: Scheduler,
  Metadata: Metadata,
  Mobile: Mobile,
  Forms: Forms,
  Entitlements: Entitlements,
  Activity: Activity,
  Resources: Resources
};