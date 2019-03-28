/* global require module*/
"use strict";

require("core-js/modules/web.dom.iterable");

const request = require("request-promise");

const util = require("./utilities");
/**
 * @async
 * @description This function will create a new workflow template
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const createWorkflowTemplate = function createWorkflowTemplate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/workflows`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function will cancel a specific running workflow instance
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [wfIntanceUUID="null wfInstanceUUID"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const cancelWorkflow = function cancelWorkflow() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let wfIntanceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null wfInstanceUUID";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfIntanceUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({
        status: "ok"
      }) : reject({
        status: "failed"
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};
/**
 * @async
 * @description This function will delete a workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [version="null version"] - workflow version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const deleteWorkflowTemplate = function deleteWorkflowTemplate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null version";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "DELETE",
    uri: `${MS}/workflows/${wfTemplateUUID}/${version}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    resolveWithFullResponse: true,
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({
        status: "ok"
      }) : reject({
        status: "failed"
      });
    }).catch(function (error) {
      reject(error);
    });
  });
};
/**
 * @async
 * @description This function will get a specific workflow instance
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [wfInstanceUUID="null wfInstanceUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const getRunningWorkflow = function getRunningWorkflow() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let wfInstanceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null wfTemplateUUID";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances/${wfInstanceUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const getWorkflowGroup = function getWorkflowGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups/${wfGroupUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function will get an execution history for a specific workflow uuid
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const getWfInstanceHistory = function getWfInstanceHistory() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfInstanceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let trace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/history/${wfInstanceUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function returns a history of a template execution.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {array} [filters=undefined] - optional filters, incuding start_datetime and end_datetime (RFC3339 format), and version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const getWfTemplateHistory = function getWfTemplateHistory() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/history`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      template_uuid: wfTemplateUUID,
      offset: offset,
      limit: limit
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function will get a specific workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] workflow template uuid
 * @param {array} [filters=undefined] - optional filters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const getWorkflowTemplate = function getWorkflowTemplate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      if (filter === "version") {
        requestOptions.uri += `/${filters[filter]}`;
      } else {
        !requestOptions.hasOwnProperty("qs") && (requestOptions.qs = {}); //init if not there

        requestOptions.qs[filter] = filters[filter];
      }
    });
  }

  return new Promise(function (resolve, reject) {
    if (typeof filters["version"] !== "undefined" && typeof filters["expand"] !== "undefined") {
      reject({
        status: "failed",
        message: "version and expand cannot be included in the same request"
      });
    } else {
      request(requestOptions).then(responseData => {
        resolve(responseData);
      }).catch(function (error) {
        reject(error);
      });
    }
  });
};
/**
 * @async
 * @description This function lists running workflow instances by template uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {string} [version=undefined] - optional filter by version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const listRunningWorkflows = function listRunningWorkflows() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  let filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
  let trace = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function will return a list of group objects
 * @param {string} [accessToken="null accesToken"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {object} [filters=undefined] - object containing optional filters (start_datetime,end_datetime,template_uuid)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


const listWorkflowGroups = function listWorkflowGroups() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accesToken";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/groups`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function lists configured workflow templates
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {number} [offset=0] - pagination offset
 * @param {number} [limit=10] - pagination limit
 * @param {string} [status=undefined] - option status filter
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const listWorkflowTemplates = function listWorkflowTemplates() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  let filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "GET",
    uri: `${MS}/workflows`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    qs: {
      offset: offset,
      limit: limit
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);

  if (filters) {
    Object.keys(filters).forEach(filter => {
      requestOptions.qs[filter] = filters[filter];
    });
  }

  return request(requestOptions);
};
/**
 * @async
 * @description This function updates a workflow template definition.
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


const modifyWorkflowTemplate = function modifyWorkflowTemplate() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/workflows/${wfTemplateUUID}`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function will start a new workflow baed on the selected template.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template UUID
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


const startWorkflow = function startWorkflow(accessToken) {
  let wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  let body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";
  let trace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "POST",
    uri: `${MS}/workflows/${wfTemplateUUID}/instances`,
    body: body,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};
/**
 * @async
 * @description This function updates the status and data for a workflow group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [groupUUID="null group uuid"] - workflow group uuid
 * @param {string} [status="null status"] - workflow instance status [ active, complete, cancelled ]
 * @param {object} [data="null data"] - workflow instance data object
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise} - promise resolving to updated workflow group
 */


const updateWorkflowGroup = function updateWorkflowGroup() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  let groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null group uuid";
  let status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null status";
  let data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null data";
  let trace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const MS = util.getEndpoint("workflow");
  const requestOptions = {
    method: "PUT",
    uri: `${MS}/groups/${groupUUID}`,
    body: {
      status: status,
      data: data
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      "x-api-version": `${util.getVersion()}`
    },
    json: true
  };
  util.addRequestTrace(requestOptions, trace);
  return request(requestOptions);
};

module.exports = {
  createWorkflowTemplate,
  cancelWorkflow,
  deleteWorkflowTemplate,
  getRunningWorkflow,
  getWfInstanceHistory,
  getWfTemplateHistory,
  getWorkflowGroup,
  getWorkflowTemplate,
  listRunningWorkflows,
  listWorkflowGroups,
  listWorkflowTemplates,
  modifyWorkflowTemplate,
  startWorkflow,
  updateWorkflowGroup
};