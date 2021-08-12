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
 * @param {string} [applicationUUID] - optional application uuid
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
  applicationUUID = undefined,
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
        "allow_anonymous_submission": allowAnonymousSubmission,
        "allow_submission_update": allowSubmissionUpdate,
        "template_uuid": template_uuid
      },
      json: true
    };

    if(typeof applicationUUID === "string"){
      requestOptions.body.application_uuid = applicationUUID;
    }
    if(typeof due_date !== "undefined"){
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
 * @description This function will GET a form template
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [templateUUID="null template uuid"] - form template uuid to look up
 * @param {string} [accountUUID=undefined] - optional account uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */
const getFormTemplate = async (
  accessToken = "null access token",
  templateUUID = "null template uuid",
  accountUUID = undefined,
  trace = {}
) => {
  try {
    // This will be swapped for a single endpoint instead of a list
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms/template`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
      try{
        requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
      } catch(error){
        throw this.formatError(error);
      }
    }
    const response = await request(requestOptions);
    // TODO swap this out with a direct get when CSRVS*** is done.
    const template = response.items.reduce((acc, curr)=>{
      if(typeof acc === "undefined"){
        if(curr.template_uuid === templateUUID){
          return curr;
        }
      }
      return acc;
    }, undefined);
    if(typeof template === "undefined"){
      throw {
        "code": 404,
        "message": `template ${templateUUID} not found`
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
const listFormTemplates = async (
  accessToken = "null access token",
  accountUUID = undefined,
  offset = 0,
  limit = 10,
  trace = {}
) => {
  try {
    // This will be swapped for a single endpoint instead of a list
    const MS = util.getEndpoint("forms");
    const requestOptions = {
      method: "GET",
      uri: `${MS}/forms/template`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        "x-api-version": `${util.getVersion()}`
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
      try{
        requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
      } catch(error){
        throw this.formatError(error);
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
  getFormTemplate,
  listFormTemplates,
  listUserForms, 
  listUserFormSubmissions,
};
