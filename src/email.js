/*global module require */
"use strict";
const util = require("./utilities");
const request = require("./requestPromise");
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
  if(Array.isArray(email.to) && email.to.length > 0){
    email.to.forEach(emailAddress => {
      emailValidator.validate(emailAddress)
        ? vError
        : vError.push(
          `recipient "${emailAddress}" invalid format`
        );
    });
  } else if (typeof email.to === "object" && email.to !== null){
    Object.keys(email.to).forEach(group => {
      if(Array.isArray(email.to[group])){
        email.to[group].forEach(emailAddress => {
          emailValidator.validate(emailAddress)
            ? vError
            : vError.push(
              `recipient "${emailAddress}" invalid format`
            );
        });
      } else {
        vError.push(`to parameter ${group} is not array`);
      } 
    });
  } else {
    vError.push("to is not array, not an object, or is empty");
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
 * @param {object} [to=[]] - array of email addresses for recipients; also can be object with arrays "to", "bcc", "cc"
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
      content: [{
        body: message,
        type: type
      }],
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
        json: true
      };

      // check for polymorphic to with bcc and cc
      const body = validatedEmail.details[0].email;
      // restructure body - required for backward compatibility 
      const newBody = {
        content: body.content,
        from: body.from,
        subject: body.subject,
        bcc: typeof body.to.bcc !== "undefined" ? body.to.bcc : [],
        cc: typeof body.to.cc !== "undefined" ? body.to.cc : [],
        replyto: typeof body.to.replyto !== "undefined" ? body.to.replyto : [],
        to: typeof body.to.to !== "undefined" ? body.to.to : (Array.isArray(body.to) ? body.to : [])
      };
      
      console.log(newBody)
      requestOptions.body = newBody;
      util.addRequestTrace(requestOptions, trace);
      const response = await request(requestOptions);
      return response;
    } else {
      validatedEmail.trace_id = trace.hasOwnProperty("trace") ? trace.trace : undefined;  
      throw validatedEmail;
    }   
  } catch(error){
    throw util.formatError(error);
  }
};

/**
 * @async
 * @description This function will send an email to the provided recipients
 * @param {string} [sender=""] - email address of sender
 * @param {object} [to=[]] - array of email addresses for recipients; also can be object with arrays "to", "bcc", "cc"
 * @param {string} [subject=""] - message subject
 * @param {string} [message=""] - mesaage
 * @param {string} [type="text"] //TODO add validation for types
 * @param {object} [attachments=[]] - array of objects for attachments 
 * @param {object} [trace = {}] - optional microservice lifecycle trace headers
 * @returns
 */
 const sendEmailAttachment = async (
  accessToken = "null accessToken",
  sender = "",
  to = [],
  subject = "",
  message = "",
  type = "text",
  attachments=[],
  trace = {}
) => {
  try {
    const validatedEmail = validateEmail({
      content: [{
        body: message,
        type: type
      }],
      attachments: attachments,
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
        json: true
      };

      // check for polymorphic to with bcc and cc
      const body = validatedEmail.details[0].email;
      // restructure body - required for backward compatibility 
      const newBody = {
        content: body.content,
        attachments: attachments,
        from: body.from,
        subject: body.subject,
        bcc: typeof body.to.bcc !== "undefined" ? body.to.bcc : [],
        cc: typeof body.to.cc !== "undefined" ? body.to.cc : [],
        replyto: typeof body.to.replyto !== "undefined" ? body.to.replyto : [],
        to: typeof body.to.to !== "undefined" ? body.to.to : (Array.isArray(body.to) ? body.to : [])
      };
      
      console.log(newBody)
      requestOptions.body = newBody;
      util.addRequestTrace(requestOptions, trace);
      const response = await request(requestOptions);
      return response;
    } else {
      validatedEmail.trace_id = trace.hasOwnProperty("trace") ? trace.trace : undefined;  
      throw validatedEmail;
    }   
  } catch(error){
    throw util.formatError(error);
  }
};

module.exports = {
  sendEmail,
  sendEmailAttachment
};
