/* global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
/**
 * @async
 * @description This function will create a new workflow template
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var createWorkflowTemplate = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null access token";
            body = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null body";
            trace = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            _context.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/workflows"),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context.next = 9;
            return request(requestOptions);

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", Promise.reject(util.formatError(_context.t0)));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 13]]);
  }));

  return function createWorkflowTemplate() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will cancel a specific running workflow instance
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [wfIntanceUUID="null wfInstanceUUID"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var cancelWorkflow = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        wfTemplateUUID,
        wfIntanceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accessToken = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "null access token";
            wfTemplateUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null wfTemplateUUID";
            wfIntanceUUID = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : "null wfInstanceUUID";
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID, "/instances/").concat(wfIntanceUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context2.next = 10;
            return request(requestOptions);

          case 10:
            response = _context2.sent;

            if (!(response.statusCode === 204)) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "cancel workflow failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](4);
            return _context2.abrupt("return", Promise.reject(util.formatError(_context2.t0)));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 18]]);
  }));

  return function cancelWorkflow() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will delete a workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [version="null version"] - workflow version
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var deleteWorkflowTemplate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        wfTemplateUUID,
        version,
        trace,
        MS,
        requestOptions,
        response,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null access token";
            wfTemplateUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null wfTemplateUUID";
            version = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : "null version";
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "DELETE",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID, "/").concat(version),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              resolveWithFullResponse: true,
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context3.next = 10;
            return request(requestOptions);

          case 10:
            response = _context3.sent;

            if (!(response.statusCode === 204)) {
              _context3.next = 15;
              break;
            }

            return _context3.abrupt("return", {
              status: "ok"
            });

          case 15:
            throw {
              "code": response.statusCode,
              "message": typeof response.body === "string" ? response.body : "delete workflow template failed",
              "trace_id": requestOptions.hasOwnProperty("headers") && requestOptions.headers.hasOwnProperty("trace") ? requestOptions.headers.trace : undefined,
              "details": _typeof(response.body) === "object" && response.body !== null ? [response.body] : []
            };

          case 16:
            _context3.next = 21;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](4);
            return _context3.abrupt("return", Promise.reject(util.formatError(_context3.t0)));

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 18]]);
  }));

  return function deleteWorkflowTemplate() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get a specific workflow instance
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template uuid
 * @param {string} [wfInstanceUUID="null wfInstanceUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getRunningWorkflow = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        wfTemplateUUID,
        wfInstanceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            accessToken = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : "null access token";
            wfTemplateUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : "null wfTemplateUUID";
            wfInstanceUUID = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : "null wfTemplateUUID";
            trace = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : {};
            _context4.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID, "/instances/").concat(wfInstanceUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context4.next = 10;
            return request(requestOptions);

          case 10:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](4);
            return _context4.abrupt("return", Promise.reject(util.formatError(_context4.t0)));

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[4, 14]]);
  }));

  return function getRunningWorkflow() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroup = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        wfGroupUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args5 = arguments;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            accessToken = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : "null access token";
            wfGroupUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : "null wfTemplateUUID";
            trace = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
            _context5.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context5.next = 9;
            return request(requestOptions);

          case 9:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", Promise.reject(util.formatError(_context5.t0)));

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 13]]);
  }));

  return function getWorkflowGroup() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {boolean} [show_master=false] - show master (defaults to false)
 * @param {boolean} [show_children=false] - show children (defaults to false)
 * @param {boolean} [show_data=false] - show data (defaults to false)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroupFiltered = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        wfGroupUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args6 = arguments;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            accessToken = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : "null access token";
            wfGroupUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : "null wfGroupUUID";
            filters = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : undefined;
            trace = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : {};
            _context6.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID, "/filter"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {},
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context6.next = 11;
            return request(requestOptions);

          case 11:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](4);
            return _context6.abrupt("return", Promise.reject(util.formatError(_context6.t0)));

          case 18:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[4, 15]]);
  }));

  return function getWorkflowGroupFiltered() {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group master by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroupMaster = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var accessToken,
        wfGroupUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args7 = arguments;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            accessToken = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : "null access token";
            wfGroupUUID = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : "null wfGroupUUID";
            trace = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : {};
            _context7.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID, "/filter/master"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context7.next = 9;
            return request(requestOptions);

          case 9:
            response = _context7.sent;
            return _context7.abrupt("return", response);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](3);
            return _context7.abrupt("return", Promise.reject(util.formatError(_context7.t0)));

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 13]]);
  }));

  return function getWorkflowGroupMaster() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group data by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroupData = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var accessToken,
        wfGroupUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args8 = arguments;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            accessToken = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : "null access token";
            wfGroupUUID = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : "null wfGroupUUID";
            trace = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : {};
            _context8.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID, "/filter/data"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context8.next = 9;
            return request(requestOptions);

          case 9:
            response = _context8.sent;
            return _context8.abrupt("return", response);

          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](3);
            return _context8.abrupt("return", Promise.reject(util.formatError(_context8.t0)));

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[3, 13]]);
  }));

  return function getWorkflowGroupData() {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group children by uuid.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroupChildren = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var accessToken,
        wfGroupUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args9 = arguments;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            accessToken = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : "null access token";
            wfGroupUUID = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : "null wfGroupUUID";
            trace = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
            _context9.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID, "/filter/children"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context9.next = 9;
            return request(requestOptions);

          case 9:
            response = _context9.sent;
            return _context9.abrupt("return", response);

          case 13:
            _context9.prev = 13;
            _context9.t0 = _context9["catch"](3);
            return _context9.abrupt("return", Promise.reject(util.formatError(_context9.t0)));

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[3, 13]]);
  }));

  return function getWorkflowGroupChildren() {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get workflow group child by child uuid
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfGroupUUID="null wfGroupUUID"] - workflow uuid
 * @param {string} [wfChildUUID="null wfChildUUID"] - child uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowGroupChild = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var accessToken,
        wfGroupUUID,
        wfChildUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args10 = arguments;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            accessToken = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : "null access token";
            wfGroupUUID = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : "null wfGroupUUID";
            wfChildUUID = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : "null wfChildUUID";
            trace = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : {};
            _context10.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups/").concat(wfGroupUUID, "/filter/children/").concat(wfChildUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context10.next = 10;
            return request(requestOptions);

          case 10:
            response = _context10.sent;
            return _context10.abrupt("return", response);

          case 14:
            _context10.prev = 14;
            _context10.t0 = _context10["catch"](4);
            return _context10.abrupt("return", Promise.reject(util.formatError(_context10.t0)));

          case 17:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[4, 14]]);
  }));

  return function getWorkflowGroupChild() {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get a filtered execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {boolean} [show_workflow_vars=false] - show workflow_vars (defaults to false)
 * @param {boolean} [show_incoming_data=false] - show incoming_data (defaults to false)
 * @param {boolean} [show_transition_results=false] - show transition results (defaults to false)
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWfInstanceHistory = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var accessToken,
        wfInstanceUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args11 = arguments;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            accessToken = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : "null access_token";
            wfInstanceUUID = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : "null wfTemplateUUID";
            filters = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : undefined;
            trace = _args11.length > 3 && _args11[3] !== undefined ? _args11[3] : {};
            _context11.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/history/").concat(wfInstanceUUID, "/filter"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {},
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context11.next = 11;
            return request(requestOptions);

          case 11:
            response = _context11.sent;
            return _context11.abrupt("return", response);

          case 15:
            _context11.prev = 15;
            _context11.t0 = _context11["catch"](4);
            return _context11.abrupt("return", Promise.reject(util.formatError(_context11.t0)));

          case 18:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[4, 15]]);
  }));

  return function getWfInstanceHistory() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get filtered workflow vars execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWfInstanceWorkflowVars = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
    var accessToken,
        wfInstanceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args12 = arguments;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            accessToken = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : "null access token";
            wfInstanceUUID = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : "null wfTemplateUUID";
            trace = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : {};
            _context12.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/history/").concat(wfInstanceUUID, "/filter/workflow_vars"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context12.next = 9;
            return request(requestOptions);

          case 9:
            response = _context12.sent;
            return _context12.abrupt("return", response);

          case 13:
            _context12.prev = 13;
            _context12.t0 = _context12["catch"](3);
            return _context12.abrupt("return", Promise.reject(util.formatError(_context12.t0)));

          case 16:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[3, 13]]);
  }));

  return function getWfInstanceWorkflowVars() {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get filtered incoming data execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWfInstanceIncomingData = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
    var accessToken,
        wfInstanceUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args13 = arguments;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            accessToken = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : "null access token";
            wfInstanceUUID = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : "null wfTemplateUUID";
            trace = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : {};
            _context13.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/history/").concat(wfInstanceUUID, "/filter/incoming_data"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context13.next = 9;
            return request(requestOptions);

          case 9:
            response = _context13.sent;
            return _context13.abrupt("return", response);

          case 13:
            _context13.prev = 13;
            _context13.t0 = _context13["catch"](3);
            return _context13.abrupt("return", Promise.reject(util.formatError(_context13.t0)));

          case 16:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[3, 13]]);
  }));

  return function getWfInstanceIncomingData() {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get filtered transaction results execution history for a specific workflow uuid
 * @param {string} [accessToken="null access_token"] - cpaas access token
 * @param {string} [wfInstanceUUID="null wfTemplateUUID"] - workflow instance uuid
 * @param {string} [wfTransitionUUID="null instance_uuid"] - workflow instance uuid
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWfInstanceResults = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
    var accessToken,
        wfInstanceUUID,
        transitionUUID,
        trace,
        MS,
        requestOptions,
        response,
        _args14 = arguments;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            accessToken = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : "null access token";
            wfInstanceUUID = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : "null wfTemplateUUID";
            transitionUUID = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : "null wfTransitionUUID";
            trace = _args14.length > 3 && _args14[3] !== undefined ? _args14[3] : {};
            _context14.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/history/").concat(wfInstanceUUID, "/filter/").concat(transitionUUID, "/results"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context14.next = 10;
            return request(requestOptions);

          case 10:
            response = _context14.sent;
            return _context14.abrupt("return", response);

          case 14:
            _context14.prev = 14;
            _context14.t0 = _context14["catch"](4);
            return _context14.abrupt("return", Promise.reject(util.formatError(_context14.t0)));

          case 17:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[4, 14]]);
  }));

  return function getWfInstanceResults() {
    return _ref14.apply(this, arguments);
  };
}();
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


var getWfTemplateHistory = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
    var accessToken,
        wfTemplateUUID,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        aggregate,
        response,
        _args15 = arguments;
    return regeneratorRuntime.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            accessToken = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : "null access token";
            wfTemplateUUID = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : "null wfTemplateUUID";
            offset = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : 0;
            limit = _args15.length > 3 && _args15[3] !== undefined ? _args15[3] : 10;
            filters = _args15.length > 4 && _args15[4] !== undefined ? _args15[4] : undefined;
            trace = _args15.length > 5 && _args15[5] !== undefined ? _args15[5] : {};
            _context15.prev = 6;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/history"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                template_uuid: wfTemplateUUID,
                offset: offset,
                limit: limit,
                short: true
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            aggregate = false;

            if (filters) {
              if (filters.hasOwnProperty("aggregate")) {
                if (typeof filters.aggregate === "boolean") {
                  aggregate = filters.aggregate;
                }

                delete filters.aggregate;
              }

              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            if (!aggregate) {
              _context15.next = 18;
              break;
            }

            _context15.next = 15;
            return util.aggregate(request, requestOptions, trace);

          case 15:
            response = _context15.sent;
            _context15.next = 21;
            break;

          case 18:
            _context15.next = 20;
            return request(requestOptions);

          case 20:
            response = _context15.sent;

          case 21:
            return _context15.abrupt("return", response);

          case 24:
            _context15.prev = 24;
            _context15.t0 = _context15["catch"](6);
            return _context15.abrupt("return", Promise.reject(util.formatError(_context15.t0)));

          case 27:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[6, 24]]);
  }));

  return function getWfTemplateHistory() {
    return _ref15.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will get a specific workflow template.
 * @param {string} [accessToken="null access token"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] workflow template uuid
 * @param {array} [filters=undefined] - optional filters
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var getWorkflowTemplate = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
    var accessToken,
        wfTemplateUUID,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args16 = arguments;
    return regeneratorRuntime.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            accessToken = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : "null access token";
            wfTemplateUUID = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : "null wfTemplateUUID";
            filters = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : undefined;
            trace = _args16.length > 3 && _args16[3] !== undefined ? _args16[3] : {};
            _context16.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                if (filter === "version") {
                  requestOptions.uri += "/".concat(filters[filter]);
                } else {
                  !requestOptions.hasOwnProperty("qs") && (requestOptions.qs = {}); //init if not there

                  requestOptions.qs[filter] = filters[filter];
                }
              });
            }

            if (!(filters && typeof filters["version"] !== "undefined" && typeof filters["expand"] !== "undefined")) {
              _context16.next = 13;
              break;
            }

            throw {
              "code": 400,
              "message": "version and expand cannot be included in the same request"
            };

          case 13:
            _context16.next = 15;
            return request(requestOptions);

          case 15:
            response = _context16.sent;
            return _context16.abrupt("return", response);

          case 17:
            _context16.next = 22;
            break;

          case 19:
            _context16.prev = 19;
            _context16.t0 = _context16["catch"](4);
            return _context16.abrupt("return", Promise.reject(util.formatError(_context16.t0)));

          case 22:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[4, 19]]);
  }));

  return function getWorkflowTemplate() {
    return _ref16.apply(this, arguments);
  };
}();
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


var listRunningWorkflows = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
    var accessToken,
        wfTemplateUUID,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args17 = arguments;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            accessToken = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : "null access token";
            wfTemplateUUID = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : "null wfTemplateUUID";
            offset = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : 0;
            limit = _args17.length > 3 && _args17[3] !== undefined ? _args17[3] : 10;
            filters = _args17.length > 4 && _args17[4] !== undefined ? _args17[4] : undefined;
            trace = _args17.length > 5 && _args17[5] !== undefined ? _args17[5] : {};
            _context17.prev = 6;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID, "/instances"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                offset: offset,
                limit: limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context17.next = 13;
            return request(requestOptions);

          case 13:
            response = _context17.sent;
            return _context17.abrupt("return", response);

          case 17:
            _context17.prev = 17;
            _context17.t0 = _context17["catch"](6);
            return _context17.abrupt("return", Promise.reject(util.formatError(_context17.t0)));

          case 20:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[6, 17]]);
  }));

  return function listRunningWorkflows() {
    return _ref17.apply(this, arguments);
  };
}();
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


var listWorkflowGroups = /*#__PURE__*/function () {
  var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args18 = arguments;
    return regeneratorRuntime.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            accessToken = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : "null accesToken";
            offset = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : 0;
            limit = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : 10;
            filters = _args18.length > 3 && _args18[3] !== undefined ? _args18[3] : undefined;
            trace = _args18.length > 4 && _args18[4] !== undefined ? _args18[4] : {};
            _context18.prev = 5;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/groups"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                offset: offset,
                limit: limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context18.next = 12;
            return request(requestOptions);

          case 12:
            response = _context18.sent;
            return _context18.abrupt("return", response);

          case 16:
            _context18.prev = 16;
            _context18.t0 = _context18["catch"](5);
            return _context18.abrupt("return", Promise.reject(util.formatError(_context18.t0)));

          case 19:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[5, 16]]);
  }));

  return function listWorkflowGroups() {
    return _ref18.apply(this, arguments);
  };
}();
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


var listWorkflowTemplates = /*#__PURE__*/function () {
  var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
    var accessToken,
        offset,
        limit,
        filters,
        trace,
        MS,
        requestOptions,
        response,
        _args19 = arguments;
    return regeneratorRuntime.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            accessToken = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : "null access token";
            offset = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : 0;
            limit = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : 10;
            filters = _args19.length > 3 && _args19[3] !== undefined ? _args19[3] : undefined;
            trace = _args19.length > 4 && _args19[4] !== undefined ? _args19[4] : {};
            _context19.prev = 5;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "GET",
              uri: "".concat(MS, "/workflows"),
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              qs: {
                offset: offset,
                limit: limit
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);

            if (filters) {
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            }

            _context19.next = 12;
            return request(requestOptions);

          case 12:
            response = _context19.sent;
            return _context19.abrupt("return", response);

          case 16:
            _context19.prev = 16;
            _context19.t0 = _context19["catch"](5);
            return _context19.abrupt("return", Promise.reject(util.formatError(_context19.t0)));

          case 19:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[5, 16]]);
  }));

  return function listWorkflowTemplates() {
    return _ref19.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function updates a workflow template definition.
 * @param {string} [accessToken="null access token"]
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"]
 * @param {string} [body="null body"]
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


var modifyWorkflowTemplate = /*#__PURE__*/function () {
  var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
    var accessToken,
        wfTemplateUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args20 = arguments;
    return regeneratorRuntime.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            accessToken = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : "null access token";
            wfTemplateUUID = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : "null wfTemplateUUID";
            body = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : "null body";
            trace = _args20.length > 3 && _args20[3] !== undefined ? _args20[3] : {};
            _context20.prev = 4;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context20.next = 10;
            return request(requestOptions);

          case 10:
            response = _context20.sent;
            return _context20.abrupt("return", response);

          case 14:
            _context20.prev = 14;
            _context20.t0 = _context20["catch"](4);
            return _context20.abrupt("return", Promise.reject(util.formatError(_context20.t0)));

          case 17:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, null, [[4, 14]]);
  }));

  return function modifyWorkflowTemplate() {
    return _ref20.apply(this, arguments);
  };
}();
/**
 * @async
 * @description This function will start a new workflow baed on the selected template.
 * @param {string} [accessToken="null accessToken"] - cpaas access token
 * @param {string} [wfTemplateUUID="null wfTemplateUUID"] - workflow template UUID
 * @param {object} [body="null body"] - workflow template body
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns {Promise}
 */


var startWorkflow = /*#__PURE__*/function () {
  var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(accessToken) {
    var wfTemplateUUID,
        body,
        trace,
        MS,
        requestOptions,
        response,
        _args21 = arguments;
    return regeneratorRuntime.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            wfTemplateUUID = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : "null wfTemplateUUID";
            body = _args21.length > 2 && _args21[2] !== undefined ? _args21[2] : "null body";
            trace = _args21.length > 3 && _args21[3] !== undefined ? _args21[3] : {};
            _context21.prev = 3;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/workflows/").concat(wfTemplateUUID, "/instances"),
              body: body,
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context21.next = 9;
            return request(requestOptions);

          case 9:
            response = _context21.sent;
            return _context21.abrupt("return", response);

          case 13:
            _context21.prev = 13;
            _context21.t0 = _context21["catch"](3);
            return _context21.abrupt("return", Promise.reject(util.formatError(_context21.t0)));

          case 16:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[3, 13]]);
  }));

  return function startWorkflow(_x) {
    return _ref21.apply(this, arguments);
  };
}();
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


var updateWorkflowGroup = /*#__PURE__*/function () {
  var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
    var accessToken,
        groupUUID,
        status,
        data,
        trace,
        MS,
        requestOptions,
        response,
        _args22 = arguments;
    return regeneratorRuntime.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            accessToken = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : "null access token";
            groupUUID = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : "null group uuid";
            status = _args22.length > 2 && _args22[2] !== undefined ? _args22[2] : "null status";
            data = _args22.length > 3 && _args22[3] !== undefined ? _args22[3] : "null data";
            trace = _args22.length > 4 && _args22[4] !== undefined ? _args22[4] : {};
            _context22.prev = 5;
            MS = util.getEndpoint("workflow");
            requestOptions = {
              method: "PUT",
              uri: "".concat(MS, "/groups/").concat(groupUUID),
              body: {
                status: status,
                data: data
              },
              headers: {
                Authorization: "Bearer ".concat(accessToken),
                "Content-type": "application/json",
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            };
            util.addRequestTrace(requestOptions, trace);
            _context22.next = 11;
            return request(requestOptions);

          case 11:
            response = _context22.sent;
            return _context22.abrupt("return", response);

          case 15:
            _context22.prev = 15;
            _context22.t0 = _context22["catch"](5);
            return _context22.abrupt("return", Promise.reject(util.formatError(_context22.t0)));

          case 18:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, null, [[5, 15]]);
  }));

  return function updateWorkflowGroup() {
    return _ref22.apply(this, arguments);
  };
}();

module.exports = {
  createWorkflowTemplate: createWorkflowTemplate,
  cancelWorkflow: cancelWorkflow,
  deleteWorkflowTemplate: deleteWorkflowTemplate,
  getRunningWorkflow: getRunningWorkflow,
  getWfInstanceHistory: getWfInstanceHistory,
  getWfTemplateHistory: getWfTemplateHistory,
  getWorkflowGroup: getWorkflowGroup,
  getWorkflowGroupFiltered: getWorkflowGroupFiltered,
  getWorkflowGroupMaster: getWorkflowGroupMaster,
  getWorkflowGroupData: getWorkflowGroupData,
  getWorkflowGroupChildren: getWorkflowGroupChildren,
  getWorkflowGroupChild: getWorkflowGroupChild,
  getWorkflowTemplate: getWorkflowTemplate,
  listRunningWorkflows: listRunningWorkflows,
  listWorkflowGroups: listWorkflowGroups,
  listWorkflowTemplates: listWorkflowTemplates,
  modifyWorkflowTemplate: modifyWorkflowTemplate,
  startWorkflow: startWorkflow,
  updateWorkflowGroup: updateWorkflowGroup,
  getWfInstanceWorkflowVars: getWfInstanceWorkflowVars,
  getWfInstanceIncomingData: getWfInstanceIncomingData,
  getWfInstanceResults: getWfInstanceResults
};