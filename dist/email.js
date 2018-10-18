/*global module require */
"use strict";

var util = require("./utilities");
var request = require("request-promise");
var emailValidator = require("email-validator");

var validateEmail = function validateEmail(email) {
  var rStatus = {
    status: 200,
    message: "valid",
    email: email
  };

  var vError = [];
  emailValidator.validate(email.from) ? vError : vError.push("sender \"" + email.from + "\" invalid format");
  if (Array.isArray(email.to) && email.to.length > 0) {
    email.to.forEach(function (emailAddress) {
      emailValidator.validate(emailAddress) ? vError : vError.push("recipient in \"to\" parameter \"" + emailAddress + "\" invalid format");
    });
  } else {
    vError.push("to is not array or is empty");
  }

  if (vError.length !== 0) {
    var message = vError.join();
    rStatus.status = 400;
    rStatus.message = message;
  }

  //console.log("RETURNING RSTATUS",rStatus);
  return rStatus;
};

/**
 * @async
 * @description This function will send an email to the provided recipients
 * @param {string} [sender=""] - email address of sender
 * @param {array} [to=""] - array of email addresses for recipients
 * @param {string} [subject=""] - message subject
 * @param {string} [message=""] - mesaage
 * @param {string} [type="text"] //TODO add validation for types
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
var sendEmail = function sendEmail() {
  var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  var sender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var subject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var message = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
  var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "text";
  var trace = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  var validEmail = validateEmail({
    content: {
      body: message,
      type: type
    },
    from: sender,
    subject: subject,
    to: to
  });

  if (validEmail.status === 200) {
    var MS = util.getEndpoint("email");
    var requestOptions = {
      method: "POST",
      uri: MS + "/messages/send",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + accessToken,
        "x-api-version": "" + util.getVersion()
      },
      body: validEmail.email,
      json: true
    };
    util.addRequestTrace(requestOptions, trace);
    return request(requestOptions);
  } else {
    return Promise.reject(validEmail);
  }
};

module.exports = {
  sendEmail: sendEmail
};