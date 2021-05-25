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
const createFormInstance = async (
  accessToken = "null access token",
  accountUUID = "null account uuid",
  status = "active",
  name = "no name",
  dueDate = undefined,
  applicationUUID = "null application uuid",
  allowAnonymousSubmission = true,
  allowSubmissionUpdate =  true,
  template_uuid =  "null template uuid",
  metadata = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/forms`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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

    if(typeof due_date === "undefined"){
      requestOptions.body.due_date = dueDate;
    }
    if(typeof metadata === "object" && metadata !== null){
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
const getFormInstance = async (
  accessToken = "null access token",
  formInstanceUUID = "null form instance uuid",
  include = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms/${formInstanceUUID}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
const listUserForms = async (
  accessToken = "null access token",
  accountUUID = undefined,
  offset = 0,
  limit = 100,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
    }
    // console.log('hhhhhh', requestOptions)
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
const listUserFormSubmissions = async (
  accessToken = "null access token",
  accountUUID = undefined,
  formUUID = undefined, 
  offset = 0,
  limit = 100,
  filters = undefined,
  trace = {}
) => {
  try {
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms/${formUUID}/submission`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
    }
    //console.log('hhhhhh', requestOptions)
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
  listUserFormSubmissions,
};
