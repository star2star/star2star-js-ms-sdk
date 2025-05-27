/*global require process module*/
"use strict";
const Accounts = require("./accounts");
const Activity = require("./activity");
const Auth = require("./auth");
const Campaigns = require("./campaigns");
const Chat = require("./chat");
const Contacts = require("./contacts");
const DbSip = require("./dbsip");
const Email = require("./email");
const Entitlements = require("./entitlements");
const Forms = require("./forms");
const Groups = require("./groups");
const Identity = require("./identity");
const Lambda = require("./lambda");
const Media = require("./media");
const Messaging = require("./messaging");
const Metadata = require("./metadata");
const Mobile = require("./mobile");
const Numbers = require("./numbers");
const Objects = require("./objects");
const Oauth = require("./oauth");
const Profiles = require("./profiles");
const Providers = require("./providers");
const Pubsub = require("./pubsub");
const ResourceGroups = require("./resourceGroups");
const Resources = require("./resources");
const Scheduler = require("./scheduler");
const ShortUrls = require("./shorturls");
const Usage = require("./usage");
const Util = require("./utilities");
const Voice = require("./voice");
const Workflow = require("./workflow");

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
  Activity,
  Auth,
  Campaigns,
  Chat,
  Contacts,
  DbSip,
  Email,
  Entitlements,
  Forms,
  getMsHost,
  Groups,
  Identity,
  Lambda,
  Media,
  Messaging,
  Metadata,
  Mobile,
  Numbers,
  Objects,
  Oauth,
  Profiles,
  Providers,
  Pubsub,
  ResourceGroups,
  Resources,
  Scheduler,
  setMsAuthHost,
  setMsHost,
  setMSVersion,
  ShortUrls,
  Usage,
  Util,
  Voice,
  Workflow
};