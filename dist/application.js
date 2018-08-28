/* global require module*/
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var request = require("request-promise");
var Objects = require("./objects");
var util = require("./utilities");
//const objectMerge = require("object-merge");

var validateApplication = function validateApplication() {
  var application = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var STATUSES = ["active", "inactive", "deprecated"];

  var rStatus = {
    status: 200,
    message: "valid",
    application: application
  };

  if ((typeof application === "undefined" ? "undefined" : _typeof(application)) !== "object") {
    rStatus.status = 400;
    rStatus.message = "application must be an object";
  } else {

    var vError = [];
    application.hasOwnProperty("name") && application.name.length !== 0 ? vError : vError.push("name missing or empty");
    application.hasOwnProperty("type") && application.type === "starpaas_application" ? vError : vError.push("name missing or empty");
    application.hasOwnProperty("description") && application.description.length !== 0 ? vError : vError.push("description missing or empty");
    application.hasOwnProperty("content_type") && application.content_type === "application/json" ? vError : vError.push("content_type missing or incorrect");
    if (application.hasOwnProperty("content") && _typeof(application.content) === "object") {
      application.content.hasOwnProperty("account_uuid") ? vError : vError.push("account_uuid missing");
      // application.content.hasOwnProperty("admins") && Array.isArray(application.content.admins) && application.content.admins.length > 0 ?  vError: vError.push("admins array missing or empty");
      // application.content.hasOwnProperty("status") && STATUSES.includes(application.content.status) ? vError: vError.push("status missing or invalid");
      // application.content.hasOwnProperty("flows") && Array.isArray(application.content.flows) ?  vError: vError.push("flows missing or not array");
      // application.content.hasOwnProperty("workspaces") && Array.isArray(application.content.workspaces) ? vError: vError.push("workspaces missing or not array");
      // application.content.hasOwnProperty("version") ? vError: vError.push("version missing");
    } else {
      vError.push("content missing or not object");
    }

    if (vError.length !== 0) {
      var message = vError.join();
      rStatus.status = 400;
      rStatus.message = message;
    }
  }
  //console.log("RETURNING RSTATUS",rStatus);  
  return rStatus;
};

/**
 * @async
 * @description This function will create a application object (application_list).
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [userUUID="null user uuid"] - user UUID to be used
 * @param {string} [name="Missing Application Name"] - name of application object
 * @param {string} [description="application description default"] - description of application object
 * @param {object} [application={} - json object defining application
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
var createApplication = function createApplication() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var userUUID = arguments[1];
  var body = arguments[2];

  var MS = util.getEndpoint("objects");
  var vApp = validateApplication(body);
  if (vApp.status === 200) {
    var requestOptions = {
      method: "POST",
      uri: MS + "/users/" + userUUID + "/objects",
      body: vApp.application,
      headers: {
        'Authorization': "Bearer " + accessToken,
        'Content-type': 'application/json',
        'x-api-version': "" + util.getVersion()
      },
      json: true
    };
    return request(requestOptions);
  } else {
    return Promise.reject(vApp);
  }
};

/**
 * @async
 * @description This function will delete application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [application_uuid="missing application uuid"] - application list UUID
 * @returns {Promise<object>} - Promise resolving to a data object
 */
var deleteApplication = function deleteApplication() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var application_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing application uuid";

  return Objects.deleteDataObject(access_token, application_uuid);
};

/**
 * @async
 * @description This function will retrieve application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [applicationObjectUUID="null uuid" - application list UUID
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
var getApplication = function getApplication() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var applicationObjectUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null uuid";

  return Objects.getDataObject(access_token, applicationObjectUUID, true);
};

/**
 * @async
 * @description This function will retrieve application list.
 * @param {string} [access_token="null access_token"] - cpaas access token
 * @param {string} [user_uuid="null user_uuid"] - user_uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional array of filters [name, description, status]
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
var listApplications = function listApplications() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var user_uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null user_uuid";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  return new Promise(function (resolve, reject) {
    Objects.getDataObjectByType(user_uuid, access_token, "starpaas_application", true).then(function (response) {
      if (filters) {
        response = util.filterResponse(response, filters);
      }
      // Paginate...This pagination is synthetic and limited to the original 100 objects we get from the API
      response = util.paginate(response, offset, limit);
      //console.log("PAGINATED RESPONSE", response);
      resolve(response);
    }).catch(function (error) {
      reject(error);
    });
  });
};

/**
 * @async
 * @description This function will modify application list.
 * @param {string} [access_token="null access_token"] - access token for cpaas systems
 * @param {string} [uuid="missing_uuid"] - application list UUID
 * @param {object} [applicationObject={}]
 * @returns {Promise<object>} - Promise resolving to a application data object
 */
var modifyApplication = function modifyApplication() {
  var access_token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access_token";
  var uuid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "missing_uuid";
  var application = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var vApp = validateApplication(application);
  if (vApp.status === 200) {
    return Objects.updateDataObject(access_token, uuid, vApp.application);
  } else {
    return Promise.reject(vApp);
  }
};

module.exports = {
  createApplication: createApplication,
  deleteApplication: deleteApplication,
  getApplication: getApplication,
  listApplications: listApplications,
  modifyApplication: modifyApplication
};