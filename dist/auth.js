/*global require module*/
"use strict";

var util = require('./utilities');
var request = require('request-promise');
var ObjectMerge = require('object-merge');

var VALID_ACTIONS = ['create', 'read', 'update', 'delete', 'list'];
var VALID_RT = ['object', 'account', 'user'];
var VALID_SCOPE = ['global', 'account', 'user'];

/**
 * This function will list all users permissions
 *
 * @param accessToken - access Token for cpaas systems
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param resource_type - filter if defined - string
 * @returns data
 **/
var listUserPermissions = function listUserPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null user uuid';
  var resource_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var actions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ['create', 'read', 'update', 'delete', 'list'];

  var MS = util.getEndpoint("auth");

  var requestOptions = {
    method: 'GET',
    uri: MS + '/users/' + userUuid + '/permissions',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-type': 'application/json'
    },
    json: true
    // resolveWithFullResponse: true
  };
  // only add filter if defined
  if (resource_type !== undefined) {
    requestOptions.qs = {
      "resource_type": resource_type
    };
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      // console.log('responseData', responseData);

      var pItems = ObjectMerge([], responseData.items);

      if (scope !== undefined) {
        pItems = pItems.filter(function (i) {
          return i.scope === scope;
        });
      }
      // console.log('>>>', pItems, actions, actions !== undefined && Array.isArray(actions));

      if (actions !== undefined && Array.isArray(actions)) {
        pItems = pItems.filter(function (i) {
          //console.log('---', actions, i.action)`
          return actions.indexOf(i.action) > -1;
        });
      }
      resolve(pItems);
    }).catch(function (responseError) {
      reject(responseError);
    });
  });
};

/**
 * This function will GET specific permissions
 *
 * @param accessToken - access Token for cpaas systems
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param resource_type - filter if defined - string
 * @param scope - required
 * @param actions - array required
 * @returns arry of permission data
 **/
var getSpecificPermissions = function getSpecificPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null user uuid';
  var resource_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var actions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];


  if (resource_type === undefined || VALID_RT.indexOf(resource_type) === -1) {
    return Promise.reject("resource_type must be specified and one of " + VALID_RT);
  }

  if (scope === undefined || VALID_SCOPE.indexOf(scope) === -1) {
    return Promise.reject("scope must be specified and one of " + VALID_SCOPE);
  }

  var missingActions = actions.filter(function (i) {
    return VALID_ACTIONS.indexOf(i) === -1;
  });
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of some or all of the follow values  " + VALID_ACTIONS);
  }

  // ok all parameters valid
  var MS = util.getEndpoint("auth");

  var requestOptions = {
    method: 'GET',
    uri: MS + '/permissions',
    qs: {
      "resource_type": resource_type
    },
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-type': 'application/json'
    },
    json: true
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      var pItems = ObjectMerge([], responseData.items);

      pItems = pItems.filter(function (i) {
        return i.scope === scope;
      });

      pItems = pItems.filter(function (i) {
        //console.log('---', actions, i.action)`
        return actions.indexOf(i.action) > -1;
      });

      resolve(pItems);
    }).catch(function (responseError) {
      reject(responseError);
    });
  });
};

/**
 * This function will add permissions to a group
 *
 * @param accessToken - access Token for cpaas systems
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param group_uuid - group uuid
 * @param resource_uuid - resource_uuid
 * @param resource_type - object, user, group
 * @param resource_scope - global, user
 * @param actions - array actions ['create', 'read','update', 'delete', 'list']
 * @returns data
 **/
var addExplicitGroupPermissions = function addExplicitGroupPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null user uuid';
  var group_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var resource_uuid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var resource_type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var resource_scope = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  var actions = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

  var MS = util.getEndpoint("auth");

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
  var missingActions = actions.filter(function (i) {
    return VALID_ACTIONS.indexOf(i) === -1;
  });
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of the follow values  " + VALID_ACTIONS);
  }

  return new Promise(function (resolve, reject) {
    //2. get permissions
    getSpecificPermissions(accessToken, userUuid, accessToken, resource_type, resource_scope, actions).then(function (pData) {
      // ok have permission object
      // loop over them which will build an array of permission objects to be posted
      var arrayOfPermissions = pData.map(function (p) {
        return {
          "permission_uuid": p.uuid,
          "resource_uuid": resource_uuid
        };
      });
      var requestOptions = {
        method: 'POST',
        uri: MS + '/groups/' + group_uuid + '/permissions',
        body: {
          "permissions": arrayOfPermissions
        },
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-type': 'application/json'
        },
        json: true
      };
      var pPromise = request(requestOptions);

      // ok i now have an array of promises
      pPromise.then(function (aPData) {
        // console.log(aPData)
        resolve(aPData);
      }).catch(function (pError) {
        reject(pError);
      });
    }).catch(function (pError) {
      reject(pError);
    });
  }); //end of new Promse
};

/**
 * This function will add permissions to a group
 *
 * @param accessToken - access Token for cpaas systems
 * @param userUuid - user UUID to be used
 * @param accessToken - access Token
 * @param user_uuid - group uuid
 * @param resource_uuid - resource_uuid
 * @param resource_type - object, user, group
 * @param resource_scope - global, user
 * @param actions - array actions
 * @returns data
 **/
var addExplicitUserPermissions = function addExplicitUserPermissions() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null access Token';
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'null user uuid';
  var user_uuid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  var resource_uuid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var resource_type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var resource_scope = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  var actions = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];

  var MS = util.getEndpoint("auth");

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
  var missingActions = actions.filter(function (i) {
    return VALID_ACTIONS.indexOf(i) === -1;
  });
  if (!Array.isArray(actions) || actions.length === 0 || missingActions.length > 0) {
    return Promise.reject("actions must be an array consisting of the follow values  " + VALID_ACTIONS);
  }

  return new Promise(function (resolve, reject) {
    //2. get permissions
    getSpecificPermissions(accessToken, userUuid, accessToken, resource_type, resource_scope, actions).then(function (pData) {
      // ok have permission object
      // loop over them which will build an array of permission objects to be posted
      var arrayOfPermissions = pData.map(function (p) {
        return {
          "permission_uuid": p.uuid,
          "resource_uuid": resource_uuid
        };
      });

      var requestOptions = {
        method: 'POST',
        uri: MS + '/users/' + user_uuid + '/permissions',
        body: {
          "permissions": arrayOfPermissions
        },
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-type': 'application/json'
        },
        json: true
      };
      var pPromise = request(requestOptions);

      pPromise.then(function (aPData) {
        // console.log(aPData)
        resolve(aPData);
      }).catch(function (pError) {
        reject(pError);
      });
    });
  }); // end promise
};

module.exports = {
  listUserPermissions: listUserPermissions,
  getSpecificPermissions: getSpecificPermissions,
  addExplicitGroupPermissions: addExplicitGroupPermissions,
  addExplicitUserPermissions: addExplicitUserPermissions
};