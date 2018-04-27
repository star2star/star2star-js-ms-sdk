/*global require module*/
"use strict";
const util = require('./utilities');
const request = require('request-promise');
const ObjectMerge = require('object-merge');

const VALID_ACTIONS = ['create', 'read', 'update', 'delete', 'list'];
const VALID_RT = ['object', 'account', 'user'];
const VALID_SCOPE = ['global', 'user'];

/**
 * This function will list all users permissions
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param resource_type - filter if defined - string
 * @returns data
 **/
const listUserPermissions = (apiKey = 'null api key', userUUID = 'null user uuid', resource_type = undefined, scope = undefined, actions = ['create', 'read', 'update', 'delete', 'list']) => {
  const MS = util.getEndpoint("auth");

  const requestOptions = {
    method: 'GET',
    uri: `${MS}/users/${userUUID}/permissions`,
    headers: {
      'application-key': apiKey,
      'Content-type': 'application/json',
      //'Authorization': `Bearer ${accessToken}`
    },
    json: true,
    // resolveWithFullResponse: true
  };
  // only add filter if defined
  if (resource_type !== undefined) {
    requestOptions.qs = {
      "resource_type": resource_type
    };
  }
  return new Promise((resolve, reject) => {
    request(requestOptions).then((responseData) => {
      console.log('responseData', responseData);

      let pItems = ObjectMerge([], responseData.items);




      if (scope !== undefined) {
        pItems = pItems.filter((i) => {
          return i.scope === scope;
        });
      }
      //console.log('>>>', actions, actions !== undefined && Array.isArray(actions));

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
 * This function will GET specific permissions
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param resource_type - filter if defined - string
 * @param scope - required
 * @param actions - array required
 * @returns arry of permission data
 **/
const getSpecificPermissions = (apiKey = 'null api key', userUUID = 'null user uuid', accessToken = 'null jwt',
  resource_type = undefined, scope = undefined, actions = []) => {

  if (resource_type === undefined || VALID_RT.indexOf(resource_type) === -1) {
    return Promise.reject("resource_type must be specified and one of " + VALID_RT);
  }


  if (scope === undefined || VALID_SCOPE.indexOf(scope) === -1) {
    return Promise.reject("scope must be specified and one of " + VALID_SCOPE);
  }

  const missingActions = actions.filter((i) => (VALID_ACTIONS.indexOf(i) === -1));
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of the follow values  " + VALID_ACTIONS);
  }

  // ok all parameters valid
  const MS = util.getEndpoint("auth");

  const requestOptions = {
    method: 'GET',
    uri: `${MS}/permissions`,
    qs: {
      "resource_type": resource_type
    },
    headers: {
      'application-key': apiKey,
      'Content-type': 'application/json',
      //'Authorization': `Bearer ${accessToken}`
    },
    json: true
  };

  return new Promise((resolve, reject) => {
    request(requestOptions).then((responseData) => {
      let pItems = ObjectMerge([], responseData);

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
 * This function will add permissions to a group
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param group_uuid - group uuid
 * @param resource_uuid - resource_uuid
 * @param resource_type - object, user, group
 * @param resource_scope - global, user
 * @param actions - array actions ['create', 'read','update', 'delete', 'list']
 * @returns data
 **/
const addExplicitGroupPermissions = (apiKey = 'null api key', userUUID = 'null user uuid', accessToken = 'null jwt',
  group_uuid = undefined, resource_uuid = undefined, resource_type = undefined, resource_scope = undefined, actions = []) => {
  const MS = util.getEndpoint("auth");

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
    getSpecificPermissions(apiKey, userUUID, accessToken, resource_type, resource_scope, actions).then((pData) => {
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
          'application-key': apiKey,
          'Content-type': 'application/json',
          //'Authorization': `Bearer ${accessToken}`
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
 * This function will add permissions to a group
 *
 * @param apiKey - api key for cpaas systems
 * @param userUUID - user UUID to be used
 * @param accessToken - access Token
 * @param user_uuid - group uuid
 * @param resource_uuid - resource_uuid
 * @param resource_type - object, user, group
 * @param resource_scope - global, user
 * @param actions - array actions
 * @returns data
 **/
const addExplicitUserPermissions = (apiKey = 'null api key', userUUID = 'null user uuid', accessToken = 'null jwt',
  user_uuid = undefined, resource_uuid = undefined, resource_type = undefined, resource_scope = undefined, actions = []) => {
  const MS = util.getEndpoint("auth");

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
    getSpecificPermissions(apiKey, userUUID, accessToken, resource_type, resource_scope, actions).then((pData) => {
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
          'application-key': apiKey,
          'Content-type': 'application/json',
          //'Authorization': `Bearer ${accessToken}`
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