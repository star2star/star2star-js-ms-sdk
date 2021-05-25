/* global require module*/
"use strict";

const request = require("request-promise");

const util = require("./utilities");
/**
 * @description This function will create a form instance from a form template uuid
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access toke 
 * @param {string} [accountUUID="null account uuid"] - account uuid
 * @param {string} [status="active"] - active or inactive
 * @param {string} [name="no name"] - instance name
 * @param {date} [dueDate=undefined] - optional due date
 * @param {string} [applicationUUID="null application uuid"] - application uuid
 * @param {boolean} [allowAnonymousSubmission=true] - allow unauthenticated submission
 * @param {boolean} [allowSubmissionUpdate=true] - allow submission to be updated
 * @param {string} [template_uuid="null template uuid"] - form template uuid
 * @param {object} [metadata=undefined] - option metadata in JSON
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


const createFormInstance = async function createFormInstance() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null account uuid";
  let status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "active";
  let name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "no name";
  let dueDate = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let applicationUUID = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "null application uuid";
  let allowAnonymousSubmission = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
  let allowSubmissionUpdate = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
  let template_uuid = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : "null template uuid";
  let metadata = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : undefined;
  let trace = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : {};

  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "POST",
      uri: "".concat(MS, "/forms"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      body: {
        "account_uuid": accountUUID,
        "status": status,
        "name": name,
        "application_uuid": applicationUUID,
        "allow_anonymous_submission": allowAnonymousSubmission,
        "allow_submission_update": allowSubmissionUpdate,
        "template_uuid": template_uuid
      },
      json: true
    };

    if (typeof due_date === "undefined") {
      requestOptions.body.due_date = dueDate;
    }

    if (typeof metadata === "object" && metadata !== null) {
      requestOptions.body.metadata = metadata;
    }

    util.addRequestTrace(requestOptions, trace);
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @description This function will GET a form instance
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token 
 * @param {string} [formInstanceUUID="null form instance uuid"] - form instance uuid
 * @param {string} [include=undefined] - option include ["metadata", "form_definition"]
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


const getFormInstance = async function getFormInstance() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let formInstanceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null form instance uuid";
  let include = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/forms/").concat(formInstanceUUID),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (typeof include === "string") {
      requestOptions.qs.include = include;
    }

    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @async
 * @description This function list user forms.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {object} [filter=undefined] - optional filter options 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const listUserForms = async function listUserForms() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/forms"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        offset: offset,
        limit: limit,
        account_uuid: accountUUID
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } // console.log('hhhhhh', requestOptions)


    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @async
 * @description This function list user form submissions.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [accountUUID="null account uuid"] - account_uuid for an star2star account (customer)
 * @param {string} [formUUID="null"] - form uuid 
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=100] - pagination limit
 * @param {object} [filter=undefined] - optional filter options 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const listUserFormSubmissions = async function listUserFormSubmissions() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let formUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;
  let filters = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
  let trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/forms/").concat(formUUID, "/submission"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        offset: offset,
        limit: limit,
        account_uuid: accountUUID
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (filters) {
      Object.keys(filters).forEach(filter => {
        requestOptions.qs[filter] = filters[filter];
      });
    } //console.log('hhhhhh', requestOptions)


    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw util.formatError(error);
  }
};

module.exports = {
  createFormInstance,
  getFormInstance,
  listUserForms,
  listUserFormSubmissions
};