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

const testContact = {
  name: {
    first: "Test",
    last: "User"
  },
  phone_numbers: [
    {
      number: "9419998765",
      preferred: true,
      type: "Home"
    }
  ]
};

describe("Contacts", function() {
  let accessToken, identityData;

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
    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
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

  it("Create User Contact", function(done) {
    if (!creds.isValid) return done();
    //console.log('--------', identityData.uuid)
    s2sMS.Contacts.createUserContact(
      accessToken,
      identityData.uuid,
      testContact
    )
      .then(responseData => {
        // console.log('Create user contact response', responseData);
        assert(responseData.name && responseData.name.first === "Test");
        done();
        s2sMS.Contacts.deleteContact(accessToken, responseData.uuid)
          .then(d => {
            // console.log('Deleted contact [Create User Contact]', responseData.uuid);
          })
          .catch(error => {
            console.log(
              "Error deleting contact [Create User Contact]",
              responseData.uuid,
              error.message
            );
          });
      })
      .catch(error => {
        console.log(
          "Error creating user contact [Create User Contact]",
          error.message
        );
        done(new Error(error));
      });
  });

  it("Delete Contact", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Contacts.createUserContact(
      accessToken,
      identityData.uuid,
      testContact
    )
      .then(responseData => {
        // console.log('Create user contact response', responseData);
        s2sMS.Contacts.deleteContact(accessToken, responseData.uuid)
          .then(d => {
            // console.log('Deleted contact [Delete Contact]', responseData.uuid);
            done(); // done after successful delete
          })
          .catch(error => {
            console.log(
              "Error deleting contact [Delete Contact]",
              responseData.uuid,
              error.message
            );
          });
      })
      .catch(error => {
        console.log(
          "Error creating user contact [Delete Contact]",
          error.message
        );
        done(new Error(error));
      });
  });

  it("List Contact", function(done) {
    if (!creds.isValid) return done();

    s2sMS.Contacts.listContacts(identityData.uuid, {}, accessToken)
      .then(responseData => {
        //console.log('list contact response', responseData);
        assert(true);
        done();
      })
      .catch(error => {
        console.log("Error listing contacts", error.message);
        done(new Error(error));
      });
  });
});
