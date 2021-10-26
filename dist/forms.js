/* global require module*/
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

var _this = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require("request-promise");

var util = require("./utilities");
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


var createFormInstance = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        accountUUID,
        status,
        name,
        dueDate,
        applicationUUID,
        allowAnonymousSubmission,
        allowSubmissionUpdate,
        template_uuid,
        metadata,
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
            accountUUID = _args.length > 1 && _args[1] !== undefined ? _args[1] : "null account uuid";
            status = _args.length > 2 && _args[2] !== undefined ? _args[2] : "active";
            name = _args.length > 3 && _args[3] !== undefined ? _args[3] : "no name";
            dueDate = _args.length > 4 && _args[4] !== undefined ? _args[4] : undefined;
            applicationUUID = _args.length > 5 && _args[5] !== undefined ? _args[5] : undefined;
            allowAnonymousSubmission = _args.length > 6 && _args[6] !== undefined ? _args[6] : true;
            allowSubmissionUpdate = _args.length > 7 && _args[7] !== undefined ? _args[7] : true;
            template_uuid = _args.length > 8 && _args[8] !== undefined ? _args[8] : "null template uuid";
            metadata = _args.length > 9 && _args[9] !== undefined ? _args[9] : undefined;
            trace = _args.length > 10 && _args[10] !== undefined ? _args[10] : {};
            _context.prev = 11;
            MS = util.getEndpoint("forms");
            requestOptions = {
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

            if (_typeof(metadata) === "object" && metadata !== null) {
              requestOptions.body.metadata = metadata;
            }

            util.addRequestTrace(requestOptions, trace);
            _context.next = 20;
            return request(requestOptions);

          case 20:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](11);
            throw util.formatError(_context.t0);

          case 27:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 24]]);
  }));

  return function createFormInstance() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @description This function will GET a form instance
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token 
 * @param {string} [formInstanceUUID="null form instance uuid"] - form instance uuid
 * @param {string} [include=undefined] - option include ["metadata", "form_definition"]
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


var getFormInstance = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var accessToken,
        formInstanceUUID,
        include,
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
            formInstanceUUID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : "null form instance uuid";
            include = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : undefined;
            trace = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            _context2.prev = 4;
            MS = util.getEndpoint("forms");
            requestOptions = {
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

            _context2.next = 11;
            return request(requestOptions);

          case 11:
            response = _context2.sent;
            return _context2.abrupt("return", response);

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](4);
            throw util.formatError(_context2.t0);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 15]]);
  }));

  return function getFormInstance() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @description This function will GET a form template
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [templateUUID="null template uuid"] - form template uuid to look up
 * @param {string} [accountUUID=undefined] - optional account uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


var getFormTemplate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var accessToken,
        templateUUID,
        accountUUID,
        trace,
        MS,
        requestOptions,
        response,
        template,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            accessToken = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : "null access token";
            templateUUID = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : "null template uuid";
            accountUUID = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
            trace = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : {};
            _context3.prev = 4;
            // This will be swapped for a single endpoint instead of a list
            MS = util.getEndpoint("forms");
            requestOptions = {
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

            if (!(typeof accountUUID === "string")) {
              _context3.next = 12;
              break;
            }

            requestOptions.qs.account_uuid = accountUUID;
            _context3.next = 19;
            break;

          case 12:
            _context3.prev = 12;
            requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
            _context3.next = 19;
            break;

          case 16:
            _context3.prev = 16;
            _context3.t0 = _context3["catch"](12);
            throw _this.formatError(_context3.t0);

          case 19:
            _context3.next = 21;
            return request(requestOptions);

          case 21:
            response = _context3.sent;
            // TODO swap this out with a direct get when CSRVS*** is done.
            template = response.items.reduce(function (acc, curr) {
              if (typeof acc === "undefined") {
                if (curr.uuid === templateUUID) {
                  return curr;
                }
              }

              return acc;
            }, undefined);

            if (!(typeof template === "undefined")) {
              _context3.next = 25;
              break;
            }

            throw {
              "code": 404,
              "message": "template ".concat(templateUUID, " not found")
            };

          case 25:
            return _context3.abrupt("return", template);

          case 28:
            _context3.prev = 28;
            _context3.t1 = _context3["catch"](4);
            throw util.formatError(_context3.t1);

          case 31:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[4, 28], [12, 16]]);
  }));

  return function getFormTemplate() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @description This function will GET a form template
 * @async
 * @param {string} [accessToken="null access token"] - CPaaS access token
 * @param {string} [templateUUID="null template uuid"] - form template uuid to look up
 * @param {string} [accountUUID=undefined] - optional account uuid
 * @param {object} [trace={}] - optional CPaaS lifecycle headers
 * @returns {Promise}
 */


var listFormTemplates = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var accessToken,
        accountUUID,
        offset,
        limit,
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
            accountUUID = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : undefined;
            offset = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 0;
            limit = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : 10;
            trace = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : {};
            _context4.prev = 5;
            // This will be swapped for a single endpoint instead of a list
            MS = util.getEndpoint("forms");
            requestOptions = {
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

            if (!(typeof accountUUID === "string")) {
              _context4.next = 13;
              break;
            }

            requestOptions.qs.account_uuid = accountUUID;
            _context4.next = 20;
            break;

          case 13:
            _context4.prev = 13;
            requestOptions.qs.account_uuid = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString()).tid;
            _context4.next = 20;
            break;

          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](13);
            throw _this.formatError(_context4.t0);

          case 20:
            _context4.next = 22;
            return request(requestOptions);

          case 22:
            response = _context4.sent;
            return _context4.abrupt("return", response);

          case 26:
            _context4.prev = 26;
            _context4.t1 = _context4["catch"](5);
            throw util.formatError(_context4.t1);

          case 29:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 26], [13, 17]]);
  }));

  return function listFormTemplates() {
    return _ref4.apply(this, arguments);
  };
}();
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


var listUserForms = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var accessToken,
        accountUUID,
        offset,
        limit,
        filters,
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
            accountUUID = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : undefined;
            offset = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 0;
            limit = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : 100;
            filters = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : undefined;
            trace = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : {};
            _context5.prev = 6;
            MS = util.getEndpoint("forms");
            requestOptions = {
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
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            } // console.log('hhhhhh', requestOptions)


            _context5.next = 13;
            return request(requestOptions);

          case 13:
            response = _context5.sent;
            return _context5.abrupt("return", response);

          case 17:
            _context5.prev = 17;
            _context5.t0 = _context5["catch"](6);
            throw util.formatError(_context5.t0);

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 17]]);
  }));

  return function listUserForms() {
    return _ref5.apply(this, arguments);
  };
}();
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


var listUserFormSubmissions = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var accessToken,
        accountUUID,
        formUUID,
        offset,
        limit,
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
            accountUUID = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : undefined;
            formUUID = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : undefined;
            offset = _args6.length > 3 && _args6[3] !== undefined ? _args6[3] : 0;
            limit = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : 100;
            filters = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : undefined;
            trace = _args6.length > 6 && _args6[6] !== undefined ? _args6[6] : {};
            _context6.prev = 7;
            MS = util.getEndpoint("forms");
            requestOptions = {
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
              Object.keys(filters).forEach(function (filter) {
                requestOptions.qs[filter] = filters[filter];
              });
            } //console.log('hhhhhh', requestOptions)


            _context6.next = 14;
            return request(requestOptions);

          case 14:
            response = _context6.sent;
            return _context6.abrupt("return", response);

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6["catch"](7);
            throw util.formatError(_context6.t0);

          case 21:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[7, 18]]);
  }));

  return function listUserFormSubmissions() {
    return _ref6.apply(this, arguments);
  };
}();

module.exports = {
  createFormInstance: createFormInstance,
  getFormInstance: getFormInstance,
  getFormTemplate: getFormTemplate,
  listFormTemplates: listFormTemplates,
  listUserForms: listUserForms,
  listUserFormSubmissions: listUserFormSubmissions
};