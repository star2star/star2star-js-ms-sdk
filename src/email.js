/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");
const emailValidator = require("email-validator");

const validateEmail = email => {
  const rStatus = {
    code: 200,
    message: "valid",
    details : [ {email: email} ]
  };

  const vError = [];
  emailValidator.validate(email.from)
    ? vError
    : vError.push(`sender "${email.from}" invalid format`);
  if (Array.isArray(email.to) && email.to.length > 0) {
    email.to.forEach(emailAddress => {
      emailValidator.validate(emailAddress)
        ? vError
        : vError.push(
          `recipient in "to" parameter "${emailAddress}" invalid format`
        );
    });
  } else {
    vError.push("to is not array or is empty");
  }

  if (vError.length !== 0) {
    rStatus.code = 400;
    rStatus.message = "invalid request",
    rStatus.details.push({"errors": vError});
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
const sendEmail = async (
  accessToken = "null accessToken",
  sender = "",
  to = [],
  subject = "",
  message = "",
  type = "text",
  trace = {}
) => {
  try {
    const validatedEmail = validateEmail({
      content: {
        body: message,
        type: type
      },
      from: sender,
      subject: subject,
      to: to
    });

    if (validatedEmail.code === 200) {
      const MS = util.getEndpoint("email");
      const requestOptions = {
        method: "POST",
        uri: `${MS}/messages/send`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-api-version": `${util.getVersion()}`
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
  } catch(error){
    return Promise.reject(util.formatError(error));
  }
};

module.exports = {
  sendEmail
};
