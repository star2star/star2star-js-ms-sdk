/*global require module*/
"use strict";
const util = require('./utilities');
const request = require('request-promise');
const ObjectMerge = require('object-merge');

const VALID_ACTIONS = ['create', 'read', 'update', 'delete', 'list'];
const VALID_RT = ['object', 'account', 'user'];
const VALID_SCOPE = ['global', 'account', 'user'];

/**
 * @async
 * @description This function will list all user's permissions
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [userUuid='null user uuid'] - user UUID to be used
 * @param {string} [resource_type=undefined] - filter if defined - 'object', 'account', 'user' 
 * @param {string} [scope=undefined] - required - 'global', 'account', 'user'
 * @param {array} [actions=['create', 'read', 'update', 'delete', 'list']]
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const listUserPermissions = (accessToken = 'null access Token', userUuid = 'null user uuid', resource_type = undefined, scope = undefined, actions = ['create', 'read', 'update', 'delete', 'list']) => {
  const MS = util.getEndpoint("auth");
  const VERSION = util.getVersion();
  const requestOptions = {
    method: 'GET',
    uri: `${MS}/users/${userUuid}/permissions`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${VERSION}`
    },
    json: true,
    // resolveWithFullResponse: true
  };
  // only add filter if defined
  if (resource_type !== undefined) {
    requestOptions.qs = {
      "resource_type": resource_type
    };
  };

  return new Promise((resolve, reject) => {
    request(requestOptions).then((responseData) => {
      // console.log('responseData', responseData);

      let pItems = ObjectMerge([], responseData.items);

      if (scope !== undefined) {
        pItems = pItems.filter((i) => {
          return i.scope === scope;
        });
      }
      // console.log('>>>', pItems, actions, actions !== undefined && Array.isArray(actions));

      if (actions !== undefined && Array.isArray(actions)) {
        pItems = pItems.filter((i) => {
          //console.log('---', actions, i.action)`
          return actions.indexOf(i.action) > -1;
        });
      }
      resolve(pItems);
    }).catch((responseError) => {
      reject(responseError);
    });
  });
};

/**
 * @async
 * @description This function will GET specific permissions.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [userUuid='null user uuid'] - user UUID to be used
 * @param {string} [resource_type=undefined] - filter if defined - 'object', 'account', 'user' 
 * @param {string} [scope=undefined] - required - 'global', 'account', 'user'
 * @param {array} [actions=['create', 'read', 'update', 'delete', 'list']]
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const getSpecificPermissions = (accessToken = 'null access Token', userUuid = 'null user uuid',
  resource_type = undefined, scope = undefined, actions = []) => {

  if (resource_type === undefined || VALID_RT.indexOf(resource_type) === -1) {
    return Promise.reject("resource_type must be specified and one of " + VALID_RT);
  }

  if (scope === undefined || VALID_SCOPE.indexOf(scope) === -1) {
    return Promise.reject("scope must be specified and one of " + VALID_SCOPE);
  }

  const missingActions = actions.filter((i) => (VALID_ACTIONS.indexOf(i) === -1));
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of some or all of the follow values  " + VALID_ACTIONS);
  }

  // ok all parameters valid
  const MS = util.getEndpoint("auth");
  const VERSION = util.getVersion();
  const requestOptions = {
    method: 'GET',
    uri: `${MS}/permissions`,
    qs: {
      "resource_type": resource_type
    },
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-api-version': `${VERSION}`
    },
    json: true
  };

  return new Promise((resolve, reject) => {
    request(requestOptions).then((responseData) => {
      let pItems = ObjectMerge([], responseData.items);

      pItems = pItems.filter((i) => {
        return i.scope === scope;
      });

      pItems = pItems.filter((i) => {
        //console.log('---', actions, i.action)`
        return actions.indexOf(i.action) > -1;
      });

      resolve(pItems);
    }).catch((responseError) => {
      reject(responseError);
    });
  });
};

/**
 * @async
 * @description This function will add permissions to a group.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [userUuid='null user uuid'] - user UUID to be used for auth
 * @param {string} [group_uuid=undefined] - group uuid receiving permissions
 * @param {string} [resource_uuid=undefined] - resource uuid
 * @param {string} [resource_type=undefined] - filter if defined - 'object', 'account', 'user' 
 * @param {string} [resource_scope=undefined] - required - 'global', 'account', 'user'
 * @param {array} [actions=['create', 'read', 'update', 'delete', 'list']]
 * @returns {Promise<object>} - Promise resolving to a data object
 */
const addExplicitGroupPermissions = (accessToken = 'null access Token', userUuid = 'null user uuid',
  group_uuid = undefined, resource_uuid = undefined, resource_type = undefined, resource_scope = undefined, actions = []) => {
  const MS = util.getEndpoint("auth");
  const VERSION = util.getVersion();
  // 1.  validate parameters
  if (group_uuid === undefined) {
    return Promise.reject("group uuid is missing");
  }
  if (resource_uuid === undefined) {
    return Promise.reject("resource uuid is missing");
  }
  if (resource_type === undefined || VALID_RT.indexOf(resource_type) === -1) {
    return Promise.reject("resource_type must be specified and one of " + VALID_RT);
  }
  if (resource_scope === undefined || VALID_SCOPE.indexOf(resource_scope) === -1) {
    return Promise.reject("scope must be specified and one of " + VALID_SCOPE);
  }
  const missingActions = actions.filter((i) => (VALID_ACTIONS.indexOf(i) === -1));
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of the follow values  " + VALID_ACTIONS);
  }

  return new Promise((resolve, reject) => {
    //2. get permissions
    getSpecificPermissions(accessToken, userUuid, accessToken, resource_type, resource_scope, actions).then((pData) => {
      // ok have permission object
      // loop over them which will build an array of permission objects to be posted
      const arrayOfPermissions = pData.map((p) => {
        return {
          "permission_uuid": p.uuid,
          "resource_uuid": resource_uuid
        };
      });
      const requestOptions = {
        method: 'POST',
        uri: `${MS}/groups/${group_uuid}/permissions`,
        body: {
          "permissions": arrayOfPermissions
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': 'application/json',
          'x-api-version': `${VERSION}`
        },
        json: true
      };
      const pPromise = request(requestOptions);

      // ok i now have an array of promises
      pPromise.then((aPData) => {
        // console.log(aPData)
        resolve(aPData);
      }).catch((pError) => {
        reject(pError);
      });
    }).catch((pError) => {
      reject(pError);
    });
  }); //end of new Promse
};

/**
 * @async 
 * @description This function will add permissions to a user.
 * @param {string} [accessToken='null access Token'] - access Token for cpaas systems
 * @param {string} [userUuid='null user uuid'] - user UUID to be used for auth
 * @param {string} [user_uuid=undefined] - user UUID receiving permissions
 * @param {string} [resource_scope=undefined] - 'global', 'user'
 * @param {string} [resource_uuid=undefined] - resource uuid
 * @param {string} [resource_type=undefined] - filter if defined - 'object', 'group', 'user' 
 * @param {array} [actions=['create', 'read', 'update', 'delete', 'list']]
 * @returns {Promise<object>} - Promise resolving to a data object.
 */
const addExplicitUserPermissions = (accessToken = 'null access Token', userUuid = 'null user uuid',
  user_uuid = undefined, resource_uuid = undefined, resource_type = undefined, resource_scope = undefined, actions = []) => {
  const MS = util.getEndpoint("auth");
  const VERSION = util.getVersion();
  // 1.  validate parameters
  if (user_uuid === undefined) {
    return Promise.reject("user uuid is missing");
  }
  if (resource_uuid === undefined) {
    return Promise.reject("resource uuid is missing");
  }
  if (resource_type === undefined || VALID_RT.indexOf(resource_type) === -1) {
    return Promise.reject("resource_type must be specified and one of " + VALID_RT);
  }
  if (resource_scope === undefined || VALID_SCOPE.indexOf(resource_scope) === -1) {
    return Promise.reject("scope must be specified and one of " + VALID_SCOPE);
  }
  const missingActions = actions.filter((i) => (VALID_ACTIONS.indexOf(i) === -1));
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of the follow values  " + VALID_ACTIONS);
  }

  return new Promise((resolve, reject) => {
    //2. get permissions
    getSpecificPermissions(accessToken, userUuid, accessToken, resource_type, resource_scope, actions).then((pData) => {
      // ok have permission object
      // loop over them which will build an array of permission objects to be posted
      const arrayOfPermissions = pData.map((p) => {
        return {
          "permission_uuid": p.uuid,
          "resource_uuid": resource_uuid
        };
      });

      const requestOptions = {
        method: 'POST',
        uri: `${MS}/users/${user_uuid}/permissions`,
        body: {
          "permissions": arrayOfPermissions
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': 'application/json',
          'x-api-version': `${util.getVersion()}`
        },
        json: true
      };
      const pPromise = request(requestOptions);

      pPromise.then((aPData) => {
        // console.log(aPData)
        resolve(aPData);
      }).catch((pError) => {
        reject(pError);
      });
    });
  }); // end promise
};

module.exports = {
  listUserPermissions,
  getSpecificPermissions,
  addExplicitGroupPermissions,
  addExplicitUserPermissions
};