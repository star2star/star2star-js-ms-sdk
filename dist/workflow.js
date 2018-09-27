/* global require module*/
"use strict";

var request = require("request-promise");
var util = require("./utilities");

/**
 * @async
 * @description This function will create a new workflow template
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {object} [body="null body"] - workflow template body
 * @returns {Promise}
 */
var createWorkflowTemplate = function createWorkflowTemplate() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null body";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "POST",
    uri: MS + "/workflows",
    body: body,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will cancel a specific running workflow instance
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [wfIntanceUUID="null wfInstanceUUID"]
 * @returns {Promise}
 */
var cancelWorkflow = function cancelWorkflow() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var wfIntanceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null wfInstanceUUID";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/workflows/" + wfTemplateUUID + "/instances/" + wfIntanceUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };
  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
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
 * @returns {Promise}
 */
var deleteWorkflowTemplate = function deleteWorkflowTemplate() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null version";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "DELETE",
    uri: MS + "/workflows/" + wfTemplateUUID + "/" + version,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    resolveWithFullResponse: true,
    json: true
  };

  return new Promise(function (resolve, reject) {
    request(requestOptions).then(function (responseData) {
      responseData.statusCode === 204 ? resolve({ "status": "ok" }) : reject({ "status": "failed" });
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
 * @returns {Promise}
 */
var getRunningWorkflow = function getRunningWorkflow() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var wfInstanceUUID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null wfTemplateUUID";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/workflows/" + wfTemplateUUID + "/instances/" + wfInstanceUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @returns {Promise}
 */
var getWorkflowGroup = function getWorkflowGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfGroupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/groups/" + wfGroupUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  return request(requestOptions);
};

/**
 * @async
 * @description This function will get an execution history for a specific workflow uuid
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow uuid
 * @returns {Promise}
 */
var getWfInstanceHistory = function getWfInstanceHistory() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfInstanceUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/history/" + wfInstanceUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

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
 * @returns {Promise}
 */
var getWfTemplateHistory = function getWfTemplateHistory() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/history",
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      "template_uuid": wfTemplateUUID,
      "offset": offset,
      "limit": limit
    },
    json: true
  };

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
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
 * @returns {Promise}
 */
var getWorkflowTemplate = function getWorkflowTemplate() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var filters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/workflows/" + wfTemplateUUID,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
      if (filter === "version") {
        requestOptions.uri += "/" + filters[filter];
      } else {
        !requestOptions.hasOwnProperty("qs") && (requestOptions.qs = {}); //init if not there
        requestOptions.qs[filter] = filters[filter];
      }
    });
  }

  return new Promise(function (resolve, reject) {
    if (typeof filters["version"] !== "undefined" && typeof filters["expand"] !== "undefined") {
      reject({ "status": "failed", "message": "version and expand cannot be included in the same request" });
    } else {
      request(requestOptions).then(function (responseData) {
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
 * @returns {Promise}
 */
var listRunningWorkflows = function listRunningWorkflows() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var filters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/workflows/" + wfTemplateUUID + "/instances",
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
  };

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
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
 * @returns
 */
var listWorkflowGroups = function listWorkflowGroups() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accesToken";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("workflow");

  var requestOptions = {
    method: "GET",
    uri: MS + "/groups",
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
  };

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
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
 * @returns {Promise}
 */
var listWorkflowTemplates = function listWorkflowTemplates() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filters = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "GET",
    uri: MS + "/workflows",
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    qs: {
      "offset": offset,
      "limit": limit
    },
    json: true
  };

  if (filters) {
    Object.keys(filters).forEach(function (filter) {
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
 * @returns
 */
var modifyWorkflowTemplate = function modifyWorkflowTemplate() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/workflows/" + wfTemplateUUID,
    body: body,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function will start a new workflow baed on the selected template.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template UUID
 * @param {object} [body="null body"] - workflow template body
 * @returns {Promise}
 */
var startWorkflow = function startWorkflow(accessToken) {
  var wfTemplateUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null wfTemplateUUID";
  var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null body";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "POST",
    uri: MS + "/workflows/" + wfTemplateUUID + "/instances",
    body: body,
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

/**
 * @async
 * @description This function updates the status and data for a workflow group
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [groupUUID="null group uuid"] - workflow group uuid
 * @param {string} [status="null status"] - workflow instance status [ active, complete, cancelled ]
 * @param {object} [data="null data"] - workflow instance data object 
 * @returns {Promise} - promise resolving to updated workflow group
 */
var updateWorkflowGroup = function updateWorkflowGroup() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null access token";
  var groupUUID = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "null group uuid";
  var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "null status";
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "null data";

  var MS = util.getEndpoint("workflow");
  var requestOptions = {
    method: "PUT",
    uri: MS + "/groups/" + groupUUID,
    body: {
      "status": status,
      "data": data
    },
    headers: {
      'Authorization': "Bearer " + accessToken,
      'Content-type': 'application/json',
      'x-api-version': "" + util.getVersion()
    },
    json: true
  };
  return request(requestOptions);
};

module.exports = {
  createWorkflowTemplate: createWorkflowTemplate,
  cancelWorkflow: cancelWorkflow,
  deleteWorkflowTemplate: deleteWorkflowTemplate,
  getRunningWorkflow: getRunningWorkflow,
  getWfInstanceHistory: getWfInstanceHistory,
  getWfTemplateHistory: getWfTemplateHistory,
  getWorkflowGroup: getWorkflowGroup,
  getWorkflowTemplate: getWorkflowTemplate,
  listRunningWorkflows: listRunningWorkflows,
  listWorkflowGroups: listWorkflowGroups,
  listWorkflowTemplates: listWorkflowTemplates,
  modifyWorkflowTemplate: modifyWorkflowTemplate,
  startWorkflow: startWorkflow,
  updateWorkflowGroup: updateWorkflowGroup
};