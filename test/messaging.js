// TODO - finish messaging unit testing
//mocha requires
import "@babel/polyfill";
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logger = Util.getLogger();

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Identity MS Unit Test Suite", function () {

  let accessToken;
  

  before(function () {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // For tests, use the dev msHost
    s2sMS.setMsHost(creds.MS_HOST);
    s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
    s2sMS.setMsAuthHost(creds.AUTH_HOST);
    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return new Promise((resolve, reject)=>{
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      )
        .then(oauthData => {
          //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
          accessToken = oauthData.access_token;
          s2sMS.Identity.getMyIdentityData(accessToken).then((idData)=>{
            s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid).then((identityDetails)=>{
              //identityData = identityDetails;
              resolve(identityDetails);
            }).catch((e1)=>{
              reject(e1);
            });
          }).catch((e)=>{
            reject(e);
          });
        });
    });
  });

  it("Send Simple SMS", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Messaging.sendSimpleSMS(
      accessToken,
      creds.smsFrom,
      creds.smsTo,
      "a test"
    )
      .then(response => {
        //console.log("SMS SENT", response);
        assert(response.hasOwnProperty("uuid"));
        done();
      })
      .catch(error => {
        console.log("Unable to send message.", error);
        done(new Error(error));
      });
  });

  //moved messaging tests here so we can user our temporary identity. NH

  it("Valid SMS Number", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Messaging.getSMSNumber(accessToken, testUUID)
      .then((sms) => {
        //console.log('SSSMMMSSS', sms);
        assert(sms == time);
        done();
      })
      .catch((error) => {
        console.log("Error getting SMS Number", JSON.stringify(error));
        done(new Error(error));
      });         
  });

  it("GetSMS for Invalid USER UUID", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Messaging.getSMSNumber(accessToken, "bad")
      .then(response => {
        console.log("This call should fail", response);
        done(new Error(response));
      })
      .catch(error => {
      //console.log('Got expected error with invalid uuid [getsms for invalid user]', error);
        assert(error.statusCode === 400);
        done();
      });
  });


  /* FIXME once CSRVS-155 is figured out
   it("Send SMS", function (done) {
     if (!creds.isValid) return done();
     s2sMS.Messaging.sendSMS(
       accessToken,
       testUUID,
       "msg",
       time,
       "9412340001"
       )
       .then(response => {
         console.log("SMS set", response);
         //assert(response.content[0].body === "msg");
         done();
       })
       .catch(error => {
         console.log("Unable to send message.", error);
         done(new Error(error));
       });
   });
*/
  // End messaging tests 
  
});