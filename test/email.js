//mocha requires

const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = require("../src/node-logger").getInstance();
let trace = Util.generateNewMetaData();

//utility function to simplify test code
const mochaAsync = (func, name) => {
  return async () => {
    try {
      const response = await func();
      logger.debug(name, response);
      return response; 
    } catch (error) {
      //mocha will log out the error
      throw error;
    }
  };
};



let accessToken, identityData;
const SENDER = typeof process.env.EMAIL_SENDER === "string" ? process.env.EMAIL_SENDER : process.env.EMAIL;

describe("Email MS Unit Test Suite", function() {
  before(async () => {
    try {
      
     // For tests, use the dev msHost
     s2sMS.setMsHost(process.env.CPAAS_URL);
     s2sMS.setMSVersion(process.env.CPAAS_API_VERSION);
     s2sMS.setMsAuthHost(process.env.AUTH_URL);
     // get accessToken to use in test cases
     // Return promise so that test cases will not fire until it resolves.
   
     const oauthData = await s2sMS.Oauth.getAccessToken(
       process.env.BASIC_TOKEN,
       process.env.EMAIL,
       process.env.PASSWORD
     );
     accessToken = oauthData.access_token;
     const idData = await s2sMS.Identity.getMyIdentityData(accessToken);
     identityData = await s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid);
    } catch (error) {
      throw error;
    }
    
  });
  
  it("Send Valid Email", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = [identityData.username];
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email"));

  it("Send Valid Email with bcc", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = {bcc: [identityData.username]};
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email with bcc"));

  it("Send Valid Email with cc", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = {cc: [identityData.username]};
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email with cc"));

  it("Send Valid Email with to", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = {to: [identityData.username]};
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email with to"));

  it("Send Valid Email with to, bcc, cc, and replyto", mochaAsync(async () => {
        trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = {bcc: [identityData.username], cc: [identityData.username], to: [identityData.username], replyto: ["third-party-support+emailtest@sangoma.com"]};
    const subject = "a test";
    const message = "a test";
    const type = "text";
    const response = await s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
  },"Send Valid Email with to, bcc, cc, and replyto"));

  it("Send Invalid Sender Email", mochaAsync(async () => {
        try{
      trace = Util.generateNewMetaData(trace);
      const sender = "invalid";
      const to = [identityData.username];
      const subject = "a test";
      const message = "a test";
      const type = "text";
      const response = await s2sMS.Email.sendEmail(
        accessToken,
        sender,
        to,
        subject,
        message,
        type
      );
      assert.ok(
        false,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.hasOwnProperty("message") &&
        error.message === "invalid request",
        JSON.stringify(error, null, "\t"));
      return error;
    }
  },"Send Invalid Sender Email"));

  it("Send Invalid Recipient Email", mochaAsync(async () => {
        try{
      trace = Util.generateNewMetaData(trace);
      const sender = SENDER;
      const to = ["invalid"];
      const subject = "a test";
      const message = "a test";
      const type = "text";
      const response = await s2sMS.Email.sendEmail(
        accessToken,
        sender,
        to,
        subject,
        message,
        type,
        trace
      );
      assert.ok(
        1 === 1,
        JSON.stringify(response, null, "\t")
      );
      return response;
    } catch(error){
      assert.ok(
        error.hasOwnProperty("message") &&
        error.message === "invalid request",
        JSON.stringify(error, null, "\t"));
      return error;
    }
    
  },"Send Invalid Recipient Email"));



  it("Send Valid Email with attachement", mochaAsync(async () => {
    trace = Util.generateNewMetaData(trace);
    const sender = SENDER;
    const to = [identityData.username];
    const subject = "email attachment test";
    const message = "<p>this is a small image&nbsp;</p><figure class=\"image\"><img src=\"cid:0\"></figure><p>footer</p>";
    const attachment = [{
      "type": "image/png",
      "id": "0",
      "body": "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII="
    }];
    const type = "html";
    const response = await s2sMS.Email.sendEmailAttachment(
      accessToken,
      sender,
      to,
      subject,
      message,
      type,
      attachment,
      trace
    );
    assert.ok(
      response.hasOwnProperty("status") &&
      response.status === "sent",
      JSON.stringify(response, null, "\t")
    );
    return response;
    },"Send Valid Email with attachment"));
  // template
  // it("change me", mochaAsync(async () => {
  //     //   trace = Util.generateNewMetaData(trace);
  //   const response = await somethingAsync();
  //   assert.ok(
  //     1 === 1,
  //     JSON.stringify(response, null, "\t")
  //   );
  //   return response;
  // },"change me"));
});
