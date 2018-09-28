/*global require process module*/
"use strict";

var Accounts = require('./accounts');
var Lambda = require('./lambda');
var Identity = require('./identity');
var Messaging = require('./messaging');
var Objects = require('./objects');
var Util = require('./utilities');
var Task = require('./task');
var Groups = require('./groups');
var ShortUrls = require('./shorturls');
var Auth = require('./auth');
var Chat = require('./chat');
var Contacts = require('./contacts');
var Oauth = require('./oauth');
var Media = require('./media');
var Pubsub = require('./pubsub');
var Application = require('./application');
var Workflow = require('./workflow');
var Email = require('./email');
var request = require('request-promise');

var cpaasKey = void 0;

/**
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas.star2star.com/api"] - valid url for microservice host server
 */
var setMsHost = function setMsHost() {
  var msHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://cpaas.star2star.com/api";

  process.env.MS_HOST = msHost;
};

/**
 * 
 * @description This function sets the microservice target authentication host (AUTH_HOST) variable.
 * @param {string} [msHost="https://auth.star2starglobal.net"] - valid url for microservice host server
 */
var setMsAuthHost = function setMsAuthHost() {
  var authHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://auth.star2starglobal.net";

  process.env.AUTH_HOST = authHost;
};

/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */
var setMSVersion = function setMSVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "v1";

  process.env.MS_VERSION = version;
};

/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */
var getMsHost = function getMsHost() {
  // setMsHost(process.env.MS_HOST);
  return process.env.MS_HOST;
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
  Groups: Groups,
  ShortUrls: ShortUrls,
  Auth: Auth,
  Oauth: Oauth,
  Chat: Chat,
  Contacts: Contacts,
  Media: Media,
  Pubsub: Pubsub,
  Application: Application,
  setMSVersion: setMSVersion,
  Workflow: Workflow,
  Email: Email
};