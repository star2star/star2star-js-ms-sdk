/* global require module*/
"use strict";

var _this = void 0;

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
 * @param {string} [applicationUUID] - optional application uuid
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
  let applicationUUID = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;
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
        "allow_anonymous_submission": allowAnonymousSubmission,
        "allow_submission_update": allowSubmissionUpdate,
        "template_uuid": template_uuid
      },
      json: true
    };

    if (typeof applicationUUID === "string") {
      requestOptions.body.application_uuid = applicationUUID;
    }

    if (typeof due_date !== "undefined") {
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
 * @description This function will GET a form template
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [templateUUID="null template uuid"] - form template uuid to look up
 * @param {string} [accountUUID=undefined] - optional account uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


const getFormTemplate = async function getFormTemplate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let templateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null template uuid";
  let accountUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  try {
    // This will be swapped for a single endpoint instead of a list
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/template"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        limit: 1000
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (typeof accountUUID === "string") {
      requestOptions.qs.account_uuid = accountUUID;
    } else {
      try {
        requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
      } catch (error) {
        throw _this.formatError(error);
      }
    }

    const response = await request(requestOptions); // TODO swap this out with a direct get when CSRVS*** is done.

    const template = response.items.reduce((acc, curr) => {
      if (typeof acc === "undefined") {
        if (curr.uuid === templateUUID) {
          return curr;
        }
      }

      return acc;
    }, undefined);

    if (typeof template === "undefined") {
      throw {
        "code": 404,
        "message": "template ".concat(templateUUID, " not found")
      };
    }

    return template;
  } catch (error) {
    throw util.formatError(error);
  }
};
/**
 * @description This function will GET a form template
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [templateUUID="null template uuid"] - form template uuid to look up
 * @param {string} [accountUUID=undefined] - optional account uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


const listFormTemplates = async function listFormTemplates() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let accountUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  try {
    // This will be swapped for a single endpoint instead of a list
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: "".concat(MS, "/template"),
      headers: {
        Authorization: "Bearer ".concat(accessToken),
        "Content-type": "application/json",
        "x-api-version": "".concat(util.getVersion())
      },
      qs: {
        limit: limit,
        offset: offset
      },
      json: true
    };
    util.addRequestTrace(requestOptions, trace);

    if (typeof accountUUID === "string") {
      requestOptions.qs.account_uuid = accountUUID;
    } else {
      try {
        requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
      } catch (error) {
        throw _this.formatError(error);
      }
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
  getFormTemplate,
  listFormTemplates,
  listUserForms,
  listUserFormSubmissions
};