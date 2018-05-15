/*global require process module*/
"use strict";

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

var request = require('request-promise');

var cpaasKey = void 0;

/**
 * This function sets the microservice host (MS_HOST) variable you want hit for microservices
 *
 * @param msHost String - valid url for microservice host server
 **/
var setMsHost = function setMsHost() {
  var msHost = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "https://cpaas.star2star.com/api";

  process.env.MS_HOST = msHost;
};

/**
 * This function sets the microservice version that will be used 
 *
 * @param msHost String - valid url for microservice host server
 **/
var setMSVersion = function setMSVersion() {
  var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "v1";

  process.env.MS_VERSION = version;
};

/**
 * This function gets the microservice host variable you want to run in
 *
 * @returns string - environment of which it has been configured
 **/
var getMsHost = function getMsHost() {
  // setMsHost(process.env.MS_HOST);
  return process.env.MS_HOST;
};

/**
 * This function set the environment variable you want to run in
 *
 * @param key String - valid cpaas application key
 **/
var setApplicationKey = function setApplicationKey() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "missing";

  cpaasKey = key;
};

/**
 * This function set the environment variable you want to run in
 *
 * @returns app key string which was set
 **/
var getApplicationKey = function getApplicationKey() {
  return cpaasKey;
};

/**
 * This function will get permissions from microservice and
 * return object with constants refering to the permission uuid
 *
 *  @param accessToken - access token
 * 
 * @returns object - key in form of {scope}_{action}_{resource_type}, value is uuid
 **/
var getPermissions = function getPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";


  return new Promise(function (resolve, reject) {
    // if no accessToken, can't get permissions
    if (accessToken === "null accessToken") reject("Required accessToken not provided");
    var permissions = {};
    var requestOptions = {
      method: "GET",
      uri: getMsHost() + '/auth/permissions?resource_type=object',
      headers: {
        "Content-type": "application/json",
        "Authorization": 'Bearer ' + accessToken,
        'x-api-version': '' + Util.getVersion()
      }
    };
    var permissionList = request(requestOptions);

    permissionList.then(function (permissionData) {
      // console.log('Permission Data', permissionData);
      var pData = JSON.parse(permissionData);

      if (pData.items.length > 0) {
        pData.items.forEach(function (pObject) {
          if (pObject.resource_type === 'object' && ['global', 'account', 'user'].indexOf(pObject.scope) !== -1) {
            var permissionIndex = pObject.scope.toUpperCase() + '_' + pObject.action.toUpperCase() + '_OBJECT}';
            permissions[permissionIndex] = pObject.uuid;
          }
        });
        // console.log('Got some permisions', permissions);
        resolve(permissions);
      } else {
        console.log('Error -- no permissions created in this microservice instance... Check with ms administrators');
        reject("Promise reject -- no permissions created in this microservice instance... Check with ms administrator");
      }
    });
  });
};

module.exports = {
  Lambda: Lambda,
  Identity: Identity,
  Messaging: Messaging,
  Objects: Objects,
  Util: Util,
  Task: Task,
  setMsHost: setMsHost,
  getMsHost: getMsHost,
  setApplicationKey: setApplicationKey,
  getApplicationKey: getApplicationKey,
  Groups: Groups,
  ShortUrls: ShortUrls,
  Auth: Auth,
  Oauth: Oauth,
  Chat: Chat,
  Contacts: Contacts,
  getPermissions: getPermissions,
  Media: Media,
  Pubsub: Pubsub,
  setMSVersion: setMSVersion
};