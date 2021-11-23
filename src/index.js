/*global require process module*/
"use strict";
const Accounts = require("./accounts");
const Lambda = require("./lambda");
const Identity = require("./identity");
const Messaging = require("./messaging");
const Objects = require("./objects");
const Util = require("./utilities");
const Groups = require("./groups");
const ShortUrls = require("./shorturls");
const Auth = require("./auth");
const Chat = require("./chat");
const Contacts = require("./contacts");
const Oauth = require("./oauth");
const Media = require("./media");
const Providers = require("./providers");
const Pubsub = require("./pubsub");
const Workflow = require("./workflow");
const Email = require("./email");
const ResourceGroups = require("./resourceGroups");
const Scheduler = require("./scheduler");
const Metadata = require("./metadata");
const Mobile = require("./mobile");
const Forms = require("./forms");
const Entitlements = require("./entitlements");
const Activity = require("./activity");
const Resources = require("./resources");

/**
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas-api.star2star.com"] - valid url for microservice host server
 */
const setMsHost = (msHost = "https://cpaas-api.star2star.com") => {
  Util.getGlobalThis().MS_HOST = msHost;
};

/**
 * 
 * @description This function sets the microservice target authentication host (AUTH_HOST) variable.
 * @param {string} [msHost="https://auth.star2star.com"] - valid url for microservice host server
 */
const setMsAuthHost = (authHost = "https://auth.star2star.com") => {
  Util.getGlobalThis().AUTH_HOST = authHost;
};

/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */
const setMSVersion = (version = "v1") => {
  Util.getGlobalThis().MS_VERSION  = version;
};

/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */
const getMsHost = () => {
  return Util.getGlobalThis().MS_HOST;
};

module.exports = {
  Accounts,
  Lambda,
  Identity,
  Messaging,
  Objects,
  Util,
  setMsHost,
  getMsHost,
  setMsAuthHost,
  Groups,
  ShortUrls,
  Auth,
  Oauth,
  Chat,
  Contacts,
  Media,
  Providers,
  Pubsub,
  setMSVersion,
  Workflow,
  Email,
  ResourceGroups,
  Scheduler,
  Metadata,
  Mobile,
  Forms,
  Entitlements,
  Activity,
  Resources
};