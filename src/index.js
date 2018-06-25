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
 * 
 * @description This function sets the microservice target host (MS_HOST) variable.
 * @param {string} [msHost="https://cpaas.star2star.com/api"] - valid url for microservice host server
 */
const setMsHost = (msHost = "https://cpaas.star2star.com/api") => {
  process.env.MS_HOST = msHost;
};

/**
 *
 * @description This function sets the microservice version that will be used.
 * @param {string} [version="v1"] - configured microservice version
 */
const setMSVersion = (version = "v1") => {
  process.env.MS_VERSION = version;
};

/**
 *
 * @description This function gets the configured microservice host variable.
 * @returns {string} - configured host URL
 */
const getMsHost = () => {
  // setMsHost(process.env.MS_HOST);
  return process.env.MS_HOST;
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

/**
 * @async
 * @description This function will get permissions from microservice and
 * return object with constants refering to the permission uuid.
 * @param {string} [accessToken="null accessToken"]
 * @returns {Promise<object>} - Promise resolving to a data object containing key in 
 * form of {scope}_{action}_{resource_type}, value is uuid
 */
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