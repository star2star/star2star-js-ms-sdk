/* global require module*/
"use strict";

var request = require("request-promise");
var Objects = require("./objects");
var util = require("./utilities");

// const validateTemplate = (template = undefined) => {
//   const vWFTemplate = {
//     "status" : 200,
//     "message": "valid workflow template",
//     "template": template
//   };

//   if (!template || typeof template !== "object"){
//     vWFTemplate.status = 400;
//     vWFTemplate.message = "template missing or not object";
//   } else {
//     const vError = [];

//     template.hasOwnProperty("name") && template.name.length !== 0 ? vError: vError.push("name missing or empty");
//     template.hasOwnProperty("description") && template.description.length !==0 ? vError: vError.push("description missing or empty");
//     template.hasOwnProperty("status") && ["active","inactive","deprecated","deleted"].includes(template.status) ? vError: vError.push("status missing or invalid");

//     if (template.hasOwnProperty("states") && typeof Array.isArray(template.states)) {
//       Object.keys(template.states).forEach(state =>{
//         template.states[state].hasOwnProperty("uuid") && 
//         template.states[state].uuid.length !== 0 ? vError: vError.push(`state ${state} uuid missing or empty`);

//         template.states[state].hasOwnProperty("name") && 
//         template.states[state].uuid.length !== 0 ? vError: vError.push(`state ${state} name missing or empty`);

//         template.states[state].hasOwnProperty("type") && 
//         ["start","normal","decision","finish"].includes(template.states[state].type) ? vError: vError.push(`state ${state} type missing or invalid`);   
//       });
//     } else {
//       vError.push("states missing or not array");
//     }

//     if (template.hasOwnProperty("transitions") && typeof Array.isArray(template.transitions)) {
//       Object.keys(template.transitions).forEach(transition =>{
//         template.transitions[transition].hasOwnProperty("uuid") && 
//         template.transitions[transition].uuid.length !== 0 ? vError: vError.push(`transition ${transition} uuid missing or empty`);

//         template.transitions[transition].hasOwnProperty("name") && 
//         template.transitions[transition].uuid.length !== 0 ? vError: vError.push(`transition ${transition} name missing or empty`); 

//         template.transitions[transition].hasOwnProperty("start_state") && 
//         template.transitions[transition].start_state.length !== 0 ? vError: vError.push(`transition ${transition} start_state missing or empty`); 

//         template.transitions[transition].hasOwnProperty("next_state") && 
//         template.transitions[transition].next_state.length !== 0 ? vError: vError.push(`transition ${transition} next_state missing or empty`); 

//         template.transitions[transition].hasOwnProperty("type") && 
//         ["normal","wait"].includes(template.transitions[transition].type) ? vError: vError.push(`transition ${transition} type missing or invalid`);   
//       });
//     } else {
//     vError.push("transitions missing or not array");
//     }

//     if (vError.length !== 0) {
//       const message = vError.join();
//       vWFTemplate.status = 400;
//       vWFTemplate.message = message;
//     }
//   }
//   return vWFTemplate;
// };

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
        requestOptions.qs[filter] = filters[filter];
      }
    });
  }

  return request(requestOptions);
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

module.exports = {
  createWorkflowTemplate: createWorkflowTemplate,
  cancelWorkflow: cancelWorkflow,
  deleteWorkflowTemplate: deleteWorkflowTemplate,
  getRunningWorkflow: getRunningWorkflow,
  getWfInstanceHistory: getWfInstanceHistory,
  getWfTemplateHistory: getWfTemplateHistory,
  getWorkflowTemplate: getWorkflowTemplate,
  listRunningWorkflows: listRunningWorkflows,
  listWorkflowTemplates: listWorkflowTemplates,
  modifyWorkflowTemplate: modifyWorkflowTemplate,
  startWorkflow: startWorkflow
};