/*global module require */
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [accountUUID="null accountUUID"] - account uuid
 * @param {object} [body="null body"] - JSON object containing new user info
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var createIdentity = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null accountUUID";
    var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
    var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "POST",
              uri: MS + "/accounts/" + accountUUID + "/identities",
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              body: body,
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            _context.next = 8;
            return request(requestOptions);

          case 8:
            return _context.abrupt("return", _context.sent);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 11]]);
  }));

  return function createIdentity() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will allow you to modify all details of identity except account_uuid, username and external_id, password and provider.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var modifyIdentity = function modifyIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/modify",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    body: body,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will deactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
var deactivateIdentity = function deactivateIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/deactivate",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will reactivate a user/identity.
 * @param {string} [accessToken="null accessToken"]
 * @param {string} [userUuid="null userUuid"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an status data object
 */
var reactivateIdentity = function reactivateIdentity() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null userUuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/reactivate",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will add aliases to an identity
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {object} [body="null body"] - object containing any combination of email, nickname, or sms alias assignments.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */
var createAlias = function createAlias() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/identities/" + userUuid + "/aliases",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    body: body,
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  //Returning "ok" here as response object does not contain alias.
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (response) {
      response.statusCode === 201 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will call the identity microservice with the credentials and accessToken you passed in.
 * @param {string} [accessToken="null accessToken"] - access token
 * @param {string} [userUuid="null user uuid"] - user_uuid for alias being created
 * @param {string} [did="null DID"] - sms number to associate with the user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object with alias
 */
var updateAliasWithDID = function updateAliasWithDID() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var did = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null DID";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/identities/" + userUuid + "/aliases/" + did,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true,
    resolveWithFullResponse: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (response) {
      response.statusCode === 202 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in and delete the user object matching the user_uuid submitted.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [userUuid="null uuid"] - uuid for a star2star user
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<empty>} - Promise resolving success or failure.
 */
var deleteIdentity = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var userUuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/identities/" + userUuid,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              json: true,
              resolveWithFullResponse: true
            };

            util.addRequestTrace(requestOptions, trace);
            _context2.next = 8;
            return request(requestOptions);

          case 8:
            response = _context2.sent;
            return _context2.abrupt("return", response.statusCode === 204 ? Promise.resolve({ status: "ok" }) : Promise.reject({ status: "failed" }));

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject({ status: "failed", "error": _context2.t0 }));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 12]]);
  }));

  return function deleteIdentity() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [email="null email"] - email address for an star2star account
 * @param {string} [pwd="null pwd"] - passowrd for that account
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var login = function login() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var email = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null email";
  var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null pwd";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/login",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    body: {
      email: email,
      password: pwd
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

//TODO not seeing this call in Tyk...investigate.
/**
 * @async
 * @description This function will return the identity data for the authenticated user.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var getMyIdentityData = function getMyIdentityData() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/me",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will call the identity microservice with the credentials and
 * accessToken you passed in.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [user_uuid="null user uuid"] - user uuid to lookup
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var getIdentityDetails = function getIdentityDetails() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/identities/" + user_uuid + "?include=alias",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function will look up an identity by username.
 * @param {string} [accessToken="null accessToken"]
 * @param {number} [offset=0] - list offset
 * @param {number} [limit=10] - number of items to return
 * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var lookupIdentity = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var MS, requestOptions;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, util.config.msDelay);
            });

          case 3:
            MS = util.getEndpoint("identity");
            requestOptions = {
              method: "GET",
              uri: MS + "/identities",
              qs: {
                offset: offset,
                limit: limit
              },
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
              json: true
            };

            util.addRequestTrace(requestOptions, trace);
            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }
            //console.log("REQUEST********",requestOptions);
            _context3.next = 9;
            return request(requestOptions);

          case 9:
            return _context3.abrupt("return", _context3.sent);

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 12]]);
  }));

  return function lookupIdentity() {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will update a user's password.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null passwordToken"] - Reset token received via email
 * @param {object} [body="null body"] - object containing email address and new password
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
var resetPassword = function resetPassword() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var passwordToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null passwordToken";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/users/password-tokens/" + passwordToken,
    body: body,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 202 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will initiate a request for a password reset token via the user email account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [emailAddress="null emailAddress"] - target email address
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to a as status message; "ok" or "failed"
 */
var generatePasswordToken = function generatePasswordToken() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var emailAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null emailAddress";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "POST",
    uri: MS + "/users/password-tokens",
    body: {
      email: emailAddress
    },
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 202 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will validate a password reset token received from email.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [password_token="null password token"] - password reset token received via email
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise<object>} - Promise resolving to an object confirming the token and target email
 */
var validatePasswordToken = function validatePasswordToken() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var password_token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null password token";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("identity");
  var requestOptions = {
    method: "GET",
    uri: MS + "/users/password-tokens/" + password_token,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  createAlias: createAlias,
  createIdentity: createIdentity,
  modifyIdentity: modifyIdentity,
  reactivateIdentity: reactivateIdentity,
  deactivateIdentity: deactivateIdentity,
  updateAliasWithDID: updateAliasWithDID,
  deleteIdentity: deleteIdentity,
  login: login,
  getMyIdentityData: getMyIdentityData,
  lookupIdentity: lookupIdentity,
  getIdentityDetails: getIdentityDetails,
  generatePasswordToken: generatePasswordToken,
  resetPassword: resetPassword,
  validatePasswordToken: validatePasswordToken
};