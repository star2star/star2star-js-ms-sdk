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
const objectMerge = require("object-merge");
const util = require("../src/utilities");
const newMeta = util.generateNewMetaData;
let trace = newMeta();
let identityData;

let creds = {
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Accounts MS Unit Test Suite", function() {
  let accessToken, accountUUID, contactUUID;
  let time = new Date()
    .getTime()
    .toString()
    .slice(-10); //FIXME Temporary until account number from deleted accounts can be reused.

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

  it("Create Account Without Parent-uuid", function(done) {
    if (!creds.isValid) return done();

    const body = {
      name: "Unit Test",
      number: time,
      type: "Reseller",
      description: "Free form text",
      address: {
        line1: "123 ABC St",
        line2: "Optional text",
        city: "Sarasota",
        state: "FL",
        postal_code: "12345",
        country: "US"
      },
      contacts: [
        {
          id: 1,
          type: "primary",
          first_name: "First",
          last_name: "Last",
          email: "abc@test.com",
          phone: "1112223333"
        }
      ],
      reference: "Free form text",
      status: "Active"
    };

    s2sMS.Accounts.createAccount(accessToken, body, trace)
      .then(response => {
        //console.log("Account Created: ", response);
        const noParentAccountUUID = response.uuid;
        //this should not have worked....clean up.
        trace = objectMerge({}, trace, newMeta(trace));
        s2sMS.Accounts.deleteAccount(accessToken, noParentAccountUUID, trace) //Test account uuid created by Create Account test
          .then(response => {
            logger.error(`Create Account Without Parent-uuid: ${JSON.stringify(response, null, "\t")}`);
            done(new Error(response));
          })
          .catch(error => {
            logger.warn(`Unable to Delete Parent Created with no Parent-uuid: ${JSON.stringify(error, null, "\t")}`);
            done(new Error(error));
          });
      })
      .catch(error => {
        logger.info(`Create Account Without Parent-uuid: ${JSON.stringify(error, null, "\t")}`);
        assert(error.statusCode === 400);
        done();
      });
  });

  it("Create Account", function(done) {
    if (!creds.isValid) return done();

    const body = {
      name: "Unit Test",
      number: ++time,
      type: "Reseller",
      description: "Free form text",
      address: {
        line1: "123 ABC St",
        line2: "Optional text",
        city: "Sarasota",
        state: "FL",
        postal_code: "12345",
        country: "US"
      },
      contacts: [
        {
          type: "primary",
          first_name: "First",
          last_name: "Last",
          email: "abc@test.com",
          phone: "1112223333"
        }
      ],
      reference: "Free form text",
      status: "Active",
      parent_uuid: identityData.account_uuid
    };
    
    s2sMS.Accounts.createAccount(accessToken, body)
      .then(response => {
        logger.info(`Create Account RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        //save the account number for other tests
        assert(response.name === "Unit Test");
        accountUUID = response.uuid;
        contactUUID = response.contacts[0].uuid;
        done();
      })
      .catch(error => {
        logger.error(`Create Account ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("List Accounts", function(done) {
    if (!creds.isValid) return done();

    s2sMS.Accounts
      .listAccounts(
        accessToken, 
        1, //offset
        1, //limit
        {
          "type": "Reseller", 
          "expand": "relationships"
        }
      )
      .then(response => {
        logger.info(`List Accounts RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.items.length === 1);
        done();
      })
      .catch(error => {
        logger.error(`List Accounts ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Get Account Data and Check Relationships", function(done) {
    if (!creds.isValid) return done();
    setTimeout(() => {
      //Workaround for CSRVS-181
      s2sMS.Accounts.getAccount(accessToken, accountUUID)
        .then(response => {
          logger.info(`Get Account Data and Check Relationships RESPONSE: ${JSON.stringify(response, null, "\t")}`);
          assert(response.uuid === accountUUID);
          assert(response.relationships.items[0].source.uuid == accountUUID);
          done();
        })
        .catch(error => {
          logger.error(`Get Account Data and Check Relationships RESPONSE: ${JSON.stringify(error, null, "\t")}`);
          done(new Error(error));
        });
    }, 2000);
  });

  it("Modify Account", function(done) {
    if (!creds.isValid) return done();

    //Test Partial Update -- Address
    const body = {
      type: "Reseller",
      description: "Free form text modified",
      reference: "Free form text",
      address: {
        line1: "456 XYZ St",
        line2: "Optional text modified",
        city: "Orlando",
        state: "FL",
        country: "US",
        postal_code: "67890"
      },
      contacts: [
        {
          uuid: contactUUID,
          type: "primary",
          email: "abcmodified@test.com",
          phone: "1112223333",
          first_name: "First",
          last_name: "Last"
        }
      ],
      uuid: accountUUID,
      name: "R11 Corp",
      number: "22222"
    };
 
    s2sMS.Accounts.modifyAccount(accessToken, accountUUID, body)
      .then(status => {
        //console.log("status",status);
        assert(status.status === "ok");
        done();
      })
      .catch(error => {
        console.log("error in getting account data", error);
        done(new Error(error));
      });
  });

  it("List Account Relationships", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Accounts.listAccountRelationships(
      accessToken,
      identityData.account_uuid,
      0,
      10 //,
      // "reseller" FIX params and assert when is CSRVS-228 fixed.
    )
      .then(response => {
        
        logger.info(`List Account Relationships RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(
          response.items.length > 0 //&&
          //response.items[0].target.uuid === identityData.account_uuid
        );
        done();
      })
      .catch(error => {
        logger.error(`List Account Relationships ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Suspend Account", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Accounts.suspendAccount(accessToken, accountUUID)
      .then(response => {
        logger.info(`Suspend Account RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`List Account Relationships ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Reinstate Account", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Accounts.reinstateAccount(accessToken, accountUUID)
      .then(response => {
        logger.info(`Reinstate Account RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Reinstate Account ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });

  it("Delete Account", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Accounts.deleteAccount(accessToken, accountUUID) //Test account uuid created by Create Account test
      .then(response => {
        logger.info(`Delete Account RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        logger.error(`Delete Account ERROR: ${JSON.stringify(error, null, "\t")}`);
        done(new Error(error));
      });
  });
});
