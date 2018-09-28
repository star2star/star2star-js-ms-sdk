/*global module require */
"use strict";
const util = require("./utilities");
const request = require("request-promise");
const emailValidator = require('email-validator');

const validateEmail = (email) => {
  const rStatus = {
    status: 200,
    message: "valid",
    email: email
  };

  const vError = [];
  emailValidator.validate(email.from) ? vError:  vError.push(`sender "${email.from}" invalid format`);
  if (Array.isArray(email.to) && email.to.length > 0) {
    email.to.forEach((emailAddress) =>{
      emailValidator.validate(emailAddress) ? vError:  vError.push(`recipient in "to" parameter "${emailAddress}" invalid format`);
    });
  } else {
    vError.push("to is not array or is empty");
  }

  if (vError.length !== 0) {
    const message = vError.join();
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
 * @returns
 */
const sendEmail = (
  accessToken = "null accessToken",
  sender = "",
  to = [],
  subject = "",
  message = "",
  type = "text"
) => {
  
  const validEmail = validateEmail(
    {
      "content": {
        "body": message,
        "type": type
      },
      "from": sender,
      "subject": subject,
      "to" : to
    }
  );

  if (validEmail.status === 200) {
    const MS = util.getEndpoint("email");
    const requestOptions = {
      method: "POST",
      uri: `${MS}/messages/send`,
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        'x-api-version': `${util.getVersion()}`
      },
      "body" : validEmail.email,
      json:true 
    };
  return request(requestOptions);
  } else {
    return Promise.reject(validEmail);
  }
};

module.exports = {
  sendEmail
};