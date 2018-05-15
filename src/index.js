/*global require process module*/
"use strict";
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


const request = require('request-promise');

let cpaasKey;

/**
 * This function sets the microservice host (MS_HOST) variable you want hit for microservices
 *
 * @param msHost String - valid url for microservice host server
 **/
const setMsHost = (msHost = "https://cpaas.star2star.com/api") => {
  process.env.MS_HOST = msHost;
};

/**
 * This function sets the microservice version that will be used 
 *
 * @param msHost String - valid url for microservice host server
 **/
const setMSVersion = (version = "v1") => {
  process.env.MS_VERSION = version;
};

/**
 * This function gets the microservice host variable you want to run in
 *
 * @returns string - environment of which it has been configured
 **/
const getMsHost = () => {
  // setMsHost(process.env.MS_HOST);
  return process.env.MS_HOST;
};


/**
 * This function set the environment variable you want to run in
 *
 * @param key String - valid cpaas application key
 **/
const setApplicationKey = (key = "missing") => {
  cpaasKey = key;
};

/**
 * This function set the environment variable you want to run in
 *
 * @returns app key string which was set
 **/
const getApplicationKey = () => {
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
const getPermissions = (accessToken = "null accessToken") => {

  return new Promise((resolve, reject) => {
    // if no accessToken, can't get permissions
    if (accessToken === "null accessToken") reject("Required accessToken not provided");
    let permissions = {};
    const requestOptions = {
      method: "GET",
      uri: `${getMsHost()}/auth/permissions?resource_type=object`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        'x-api-version': `${Util.getVersion()}`
      },
    };
    const permissionList = request(requestOptions);

    permissionList.then((permissionData) => {
      // console.log('Permission Data', permissionData);
      const pData = JSON.parse(permissionData);

      if (pData.items.length > 0) {
        pData.items.forEach((pObject) => {
          if (pObject.resource_type === 'object' && ['global', 'account', 'user'].indexOf(pObject.scope) !== -1) {
            const permissionIndex = `${pObject.scope.toUpperCase()}_${pObject.action.toUpperCase()}_OBJECT}`;
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
  Lambda,
  Identity,
  Messaging,
  Objects,
  Util,
  Task,
  setMsHost,
  getMsHost,
  setApplicationKey,
  getApplicationKey,
  Groups,
  ShortUrls,
  Auth,
  Oauth,
  Chat,
  Contacts,
  getPermissions,
  Media,
  Pubsub,
  setMSVersion
};