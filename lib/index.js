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
/**
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas-api.star2star.com"] - valid url for microservice host server
 */


var setMsHost = function setMsHost() {
  var msHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://cpaas-api.star2star.com";
  Util.getThis().MS_HOST = msHost;
};
/**
 * 
 * @description This function sets the microservice target authentication host (AUTH_HOST) variable.
 * @param {string} [msHost="https://auth.star2star.com"] - valid url for microservice host server
 */


var setMsAuthHost = function setMsAuthHost() {
  var authHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://auth.star2star.com";
  Util.getThis().AUTH_HOST = authHost;
};
/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */


var setMSVersion = function setMSVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "v1";
  Util.getThis().MS_VERSION = version;
};
/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */


var getMsHost = function getMsHost() {
  return Util.getThis().MS_HOST;
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
  Activity: Activity
};