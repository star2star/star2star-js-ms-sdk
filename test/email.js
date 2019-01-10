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

let accessToken, identityData;

describe("Accounts MS Unit Test Suite", function() {
  before(function() {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
    s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
    return new Promise((resolve, reject) => {
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_TOKEN,
        creds.email,
        creds.password
      ).then(oauthData => {
        //console.log('Got access token and identity data -[Get Object By Data Type] ',  oauthData);
        accessToken = oauthData.access_token;
        s2sMS.Identity.getMyIdentityData(accessToken)
          .then(idData => {
            s2sMS.Identity.getIdentityDetails(accessToken, idData.user_uuid)
              .then(identityDetails => {
                identityData = identityDetails;
                resolve();
              })
              .catch(e1 => {
                reject(e1);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  });

  it("Send Valid Email", function(done) {
    if (!creds.isValid) return done();
    const sender = identityData.username;
    const to = [identityData.username];
    const subject = "a test";
    const message = "a test";
    const type = "text";
    s2sMS.Email.sendEmail(
      accessToken,
      sender,
      to,
      subject,
      message,
      type
    )
      .then(response => {
        logger.info(`Send Valid Email: ${JSON.stringify(response)}`);
        assert(
          response.hasOwnProperty("datetime") && response.status === "sent"
        );
        done();
      })
      .catch(error => {
        logger.error(`Send Valid Email: ${JSON.stringify(error)}`);
        done(new Error(error));
      });
  });

  it("Send Invalid Sender Email", function(done) {
    if (!creds.isValid) return done();
    const sender = "invalid";
    const to = [identityData.username];
    const subject = "a test";
    const message = "a test";
    const type = "text";
    s2sMS.Email.sendEmail(accessToken, sender, to, subject, message, type)
      .then(response => {
        logger.error(`Send Invalid Sender Email: ${JSON.stringify(response)}`);
        assert(false);
        done(new Error(response));
      })
      .catch(error => {
        logger.info(`Send Invalid Sender Email: ${JSON.stringify(error)}`);
        assert(error.status === 400); //this will hang if not true
        done();
      });
  });

  it("Send Invalid Recipient Email", function(done) {
    if (!creds.isValid) return done();
    const sender = identityData.username;
    const to = ["invalid"];
    const subject = "a test";
    const message = "a test";
    const type = "text";
    s2sMS.Email.sendEmail(accessToken, sender, to, subject, message, type)
      .then(response => {
        logger.error(`Send Invalid Recipient Email: ${JSON.stringify(response)}`);
        assert(false);
        done(new Error(response));
      })
      .catch(error => {
        logger.info(`Send Invalid Recipient Email: ${JSON.stringify(error)}`);
        assert(error.status === 400); //this will hang if not true
        done();
      });
  });
});
