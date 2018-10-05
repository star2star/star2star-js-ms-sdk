/*global require process module*/
"use strict";
const Accounts = require('./accounts');
const Lambda = require('./lambda');
const Identity = require('./identity');
const Messaging = require('./messaging');
const Objects = require('./objects');
const Util = require('./utilities');
const Task = require('./task');
const Groups = require('./groups');
const ShortUrls = require('./shorturls');
const Auth = require('./auth');
const Chat = require('./chat');
const Contacts = require('./contacts');
const Oauth = require('./oauth');
const Media = require('./media');
const Pubsub = require('./pubsub');
const Application = require('./application');
const Workflow = require('./workflow');
const Email = require('./email');
const request = require('request-promise');

let cpaasKey;

/**
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas.star2star.com/api"] - valid url for microservice host server
 */
const setMsHost = (msHost = "https://cpaas.star2star.com/api") => {
  Util.isBrowser() ? window.s2sJsMsSdk.MS_HOST = msHost : process.env.MS_HOST = msHost;
};

/**
 * 
 * @description This function sets the microservice target authentication host (AUTH_HOST) variable.
 * @param {string} [msHost="https://auth.star2starglobal.net"] - valid url for microservice host server
 */
const setMsAuthHost = (authHost = "https://auth.star2starglobal.net") => {
  Util.isBrowser() ? window.s2sJsMsSdk.AUTH_HOST = authHost : process.env.AUTH_HOST = authHost;
};

/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */
const setMSVersion = (version = "v1") => {
  Util.isBrowser() ? window.s2sJsMsSdk.MS_VERSION = version : process.env.MS_VERSION = version;
};

/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */
const getMsHost = () => {
  return Util.isBrowser() ? window.s2sJsMsSdk.MS_HOST : process.env.MS_HOST;
};

/**
 *
 *@description This function sets the application key.
 * @param {string} [key="missing"] - valid cpaas application key
 */
const setApplicationKey = (key = "missing") => {
  cpaasKey = key;
};

/**
 *
 * @description This function returns the previously set app key.
 * @returns {string} - app key
 */
const getApplicationKey = () => {
  return cpaasKey;
};

module.exports = {
  Accounts,
  Lambda,
  Identity,
  Messaging,
  Objects,
  Util,
  Task,
  setMsHost,
  getMsHost,
  setMsAuthHost,
  setApplicationKey,
  getApplicationKey,
  Groups,
  ShortUrls,
  Auth,
  Oauth,
  Chat,
  Contacts,
  Media,
  Pubsub,
  Application,
  setMSVersion,
  Workflow,
  Email
};