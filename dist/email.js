/*global module require */
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

require("regenerator-runtime/runtime.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var util = require("./utilities");

var request = require("request-promise");

var emailValidator = require("email-validator");

var validateEmail = function validateEmail(email) {
  var rStatus = {
    code: 200,
    message: "valid",
    details: [{
      email: email
    }]
  };
  var vError = [];
  emailValidator.validate(email.from) ? vError : vError.push("sender \"".concat(email.from, "\" invalid format"));

  if (Array.isArray(email.to) && email.to.length > 0) {
    email.to.forEach(function (emailAddress) {
      emailValidator.validate(emailAddress) ? vError : vError.push("recipient \"".concat(emailAddress, "\" invalid format"));
    });
  } else if (_typeof(email.to) === "object" && email.to !== null) {
    Object.keys(email.to).forEach(function (group) {
      if (Array.isArray(email.to[group])) {
        email.to[group].forEach(function (emailAddress) {
          emailValidator.validate(emailAddress) ? vError : vError.push("recipient \"".concat(emailAddress, "\" invalid format"));
        });
      } else {
        vError.push("to parameter ".concat(group, " is not array"));
      }
    });
  } else {
    vError.push("to is not array, not an object, or is empty");
  }

  if (vError.length !== 0) {
    rStatus.code = 400;
    rStatus.message = "invalid request", rStatus.details.push({
      "errors": vError
    });
  } //console.log("RETURNING RSTATUS",rStatus);


  return rStatus;
};
/**
 * @async
 * @description This function will send an email to the provided recipients
 * @param {string} [sender=""] - email address of sender
 * @param {object} [to=[]] - array of email addresses for recipients; also can be object with arrays "to", "bcc", "cc"
 * @param {string} [subject=""] - message subject
 * @param {string} [message=""] - mesaage
 * @param {string} [type="text"] //TODO add validation for types
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


var sendEmail = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var accessToken,
        sender,
        to,
        subject,
        message,
        type,
        trace,
        validatedEmail,
        MS,
        requestOptions,
        body,
        response,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accessToken = _args.length > 0 && _args[0] !== undefined ? _args[0] : "null accessToken";
            sender = _args.length > 1 && _args[1] !== undefined ? _args[1] : "";
            to = _args.length > 2 && _args[2] !== undefined ? _args[2] : [];
            subject = _args.length > 3 && _args[3] !== undefined ? _args[3] : "";
            message = _args.length > 4 && _args[4] !== undefined ? _args[4] : "";
            type = _args.length > 5 && _args[5] !== undefined ? _args[5] : "text";
            trace = _args.length > 6 && _args[6] !== undefined ? _args[6] : {};
            _context.prev = 7;
            validatedEmail = validateEmail({
              content: [{
                body: message,
                type: type
              }],
              from: sender,
              subject: subject,
              to: to
            });

            if (!(validatedEmail.code === 200)) {
              _context.next = 24;
              break;
            }

            MS = util.getEndpoint("email");
            requestOptions = {
              method: "POST",
              uri: "".concat(MS, "/messages/send"),
              headers: {
                "Content-type": "application/json",
                Authorization: "Bearer ".concat(accessToken),
                "x-api-version": "".concat(util.getVersion())
              },
              json: true
            }; // check for polymorphic to with bcc and cc

            body = validatedEmail.details[0].email;
            body.bcc = typeof body.to.bcc !== "undefined" ? body.to.bcc : [];
            body.cc = typeof body.to.cc !== "undefined" ? body.to.cc : [];
            body.to = typeof body.to.to !== "undefined" ? body.to.to : Array.isArray(body.to) ? body.to : [];
            requestOptions.body = body;
            util.addRequestTrace(requestOptions, trace);
            _context.next = 20;
            return request(requestOptions);

          case 20:
            response = _context.sent;
            return _context.abrupt("return", response);

          case 24:
            validatedEmail.trace_id = trace.hasOwnProperty("trace") ? trace.trace : undefined;
            throw validatedEmail;

          case 26:
            _context.next = 31;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](7);
            throw util.formatError(_context.t0);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 28]]);
  }));

  return function sendEmail() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  sendEmail: sendEmail
};