/*global module require */
"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require("./utilities");
var request = require("request-promise");

/**
 * @async
 * @description This function will create a relationship between two accounts.
 * @param {string} [accessToken="null access token"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing new relationship
 */
var createRelationship = function createRelationship() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "POST",
    uri: MS + "/relationships",
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    }
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

/**
 * @async
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {number} [offset=0] - optional; return the list starting at a specified index
 * @param {number} [limit=10] - optional; return a specified number of accounts
  * @param {array} [filters=undefined] - optional array of key-value pairs to filter response.
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
var listAccounts = function listAccounts() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  var trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts",
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
  //console.log("REQUEST_OPTIONS",requestOptions);
  return request(requestOptions);
};

/**
 * @async
 * @description This function creates a new account.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas systems
 * @param {string} [body="null body"] - object containing account details
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an account data object
 */
var createAccount = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "POST",
              uri: MS + "/accounts",
              body: body,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              },
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

  return function createAccount() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @async
 * @description This function will return an account by UUID.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {string} [expand = "identities"] - expand data in response; currently "identities" or "relationship"
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to an identity data object
 */
var getAccount = function getAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID,
    qs: {
      expand: "relationships"
    },
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
 * @description This function will modify an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var modifyAccount = function modifyAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  var trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  //body = JSON.stringify(body);
  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/accounts/" + accountUUID,
    body: body,
    resolveWithFullResponse: true,
    json: true,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-type": "application/json",
      "x-api-version": "" + util.getVersion()
    }
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
 * @description This function returns all available accounts.
 * @param {string} [accessToken="null accessToken"] - access token for cpaas system
 * @param {string} [accountUUID="null account uuid"] - account uuid of the parent
 * @param {number} [offset=0] - what page number you want
 * @param {number} [limit=10] - size of the page or number of records to return
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a data object containing a list of accounts
 */
//TODO add sort order also
var listAccountRelationships = function listAccountRelationships() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var accountType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  var trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "GET",
    uri: MS + "/accounts/" + accountUUID + "/relationships",
    qs: {
      expand: "accounts",
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

  if (accountType) {
    requestOptions.qs.account_type = accountType;
  }

  //TODO remove this stuff once account_type is supported CSRVS-158
  return request(requestOptions);
};

/**
 * @async
 * @description This function will set an account status to "Active"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var reinstateAccount = function reinstateAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "POST",
    uri: MS + "/accounts/" + accountUUID + "/reinstate",
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
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will set an account status to "Inactive"
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var suspendAccount = function suspendAccount() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var MS = util.getEndpoint("accounts");
  var requestOptions = {
    method: "POST",
    uri: MS + "/accounts/" + accountUUID + "/suspend",
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
      responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will delete an account.
 * @param {string} [accessToken="null access token"] - access token for cpaas systems
 * @param {string} [accountUUID="null account uuid"] - uuid of account to delete
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers 
 * @returns {Promise<object>} - Promise resolving to a status data object
 */
var deleteAccount = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
    var accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
    var trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var MS, requestOptions;
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
            MS = util.getEndpoint("accounts");
            requestOptions = {
              method: "DELETE",
              uri: MS + "/accounts/" + accountUUID,
              resolveWithFullResponse: true,
              json: true,
              headers: {
                Authorization: "Bearer " + accessToken,
                "Content-type": "application/json",
                "x-api-version": "" + util.getVersion()
              }
            };

            util.addRequestTrace(requestOptions, trace);

            _context2.next = 8;
            return new Promise(function (resolve, reject) {
              request(requestOptions).then(function (responseData) {
                responseData.statusCode === 204 ? resolve({ status: "ok" }) : reject({ status: "failed" });
              }).catch(function (error) {
                reject(error);
              });
            });

          case 8:
            return _context2.abrupt("return", _context2.sent);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 11]]);
  }));

  return function deleteAccount() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  createRelationship: createRelationship,
  createAccount: createAccount,
  deleteAccount: deleteAccount,
  listAccountRelationships: listAccountRelationships,
  listAccounts: listAccounts,
  getAccount: getAccount,
  modifyAccount: modifyAccount,
  reinstateAccount: reinstateAccount,
  suspendAccount: suspendAccount
};