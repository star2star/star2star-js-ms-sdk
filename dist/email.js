/*global module require */
"use strict";

const util = require("./utilities");

const request = require("request-promise");

const emailValidator = require("email-validator");

const validateEmail = email => {
  const rStatus = {
    code: 200,
    message: "valid",
    details: [{
      email: email
    }]
  };
  const vError = [];
  emailValidator.validate(email.from) ? vError : vError.push("sender \"".concat(email.from, "\" invalid format"));
  [email.to, email.bcc, email.cc].forEach(group => {
    if (Array.isArray(group)) {
      group.forEach(emailAddress => {
        emailValidator.validate(emailAddress) ? vError : vError.push("recipient \"".concat(emailAddress, "\" invalid format"));
      });
    } else {
      vError.push("to is not array or is empty");
    }
  });

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
 * @param {array} [to=[]] - array of email addresses for recipients
 * @param {array} [bcc=[]] - array of email addresses for blind copy recipients
 * @param {array} [cc=[]] - array of email addresses for copy recipients
 * @param {string} [subject=""] - message subject
 * @param {string} [message=""] - mesaage
 * @param {string} [type="text"] //TODO add validation for types
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */


const sendEmail = async function sendEmail() {
  let accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "null accessToken";
  let sender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let bcc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  let cc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  let subject = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";
  let message = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "";
  let type = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "text";
  let trace = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

  try {
    const validatedEmail = validateEmail({
      content: [{
        body: message,
        type: type
      }],
      from: sender,
      subject: subject,
      to: to,
      bcc: bcc,
      cc: cc
    });

    if (validatedEmail.code === 200) {
      const MS = util.getEndpoint("email");
      const requestOptions = {
        method: "POST",
        uri: "".concat(MS, "/messages/send"),
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer ".concat(accessToken),
          "x-api-version": "".concat(util.getVersion())
        },
        body: validatedEmail.details[0].email,
        json: true
      };
      util.addRequestTrace(requestOptions, trace);
      const response = await request(requestOptions);
      return response;
    } else {
      validatedEmail.trace_id = trace.hasOwnProperty("trace") ? trace.trace : undefined;
      return Promise.reject(validatedEmail);
    }
  } catch (error) {
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  sendEmail
};