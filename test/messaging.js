// TODO - finish messaging unit testing
//mocha reqruies
require("babel-polyfill");
const assert = require("assert");
const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const before = mocha.before;

//test requires
const fs = require("fs");
const s2sMS = require("../src/index");
const Util = require("../src/utilities");
const logLevel = Util.getLogLevel();
const logPretty = Util.getLogPretty();
import Logger from "../src/node-logger";
const logger = new Logger();
logger.setLevel(logLevel);
logger.setPretty(logPretty);

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
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
    s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
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
});