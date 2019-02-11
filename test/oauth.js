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

describe("Oauth MS", function() {
  let accessToken,
    userUUID,
    publicID,
    secret,
    clientUUID,
    clientBasicToken,
    clientAccessToken;

  before(function() {
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    s2sMS.setMSVersion(creds.CPAAS_API_VERSION);
    s2sMS.setMsAuthHost("https://auth.star2starglobal.net");
  });

  it("Get Access Token", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.getAccessToken(
      creds.CPAAS_OAUTH_TOKEN,
      creds.email,
      creds.password
    )
      .then(oauthData => {
        accessToken = oauthData.access_token;
        // logger.info(
        //   `Generate Access Token RESPONSE: ${JSON.stringify(
        //     oauthData,
        //     null,
        //     "\t"
        //   )}`
        // );
        assert(
          oauthData.hasOwnProperty("access_token") &&
            oauthData.hasOwnProperty("refresh_token") &&
            oauthData.hasOwnProperty("expires_in")
        );
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Generate Basic Token ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("Refresh Token", function(done) {
    if (!creds.isValid) return done();
    // get access token
    s2sMS.Oauth.getAccessToken(
      creds.CPAAS_OAUTH_TOKEN,
      creds.email,
      creds.password
    )
      .then(oauthData => {
        const oData = oauthData;
        // Use new refresh token to test refreshAccessToken()
        s2sMS.Oauth.refreshAccessToken(
          creds.CPAAS_OAUTH_TOKEN,
          oData.refresh_token
        )
          .then(refreshData => {
            const rData = refreshData;
            // logger.info(
            //   `Refresh Token RESPONSE: ${JSON.stringify(refreshData, null, "\t")}`
            // );
            assert(
              rData.hasOwnProperty("access_token") &&
                rData.hasOwnProperty("refresh_token") &&
                rData.hasOwnProperty("expires_in")
            );
            done();
          })
          .catch(error => {
            // logger.error(
            //   `Refresh Token ERROR: ${JSON.stringify(error, null, "\t")}`
            // );
            done(new Error(error));
          });
      })
      .catch(error => {
        //console.log("Failed to get access token [refresh token]", error);
        done(new Error(error));
      });
  });

  it("Get Client Token", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.getClientToken(creds.CPAAS_OAUTH_TOKEN)
      .then(oauthData => {
        // logger.info(
        //   `Get Client Token RESPONSE: ${JSON.stringify(oauthData, null, "\t")}`
        // );
        assert(oauthData.hasOwnProperty("access_token"));
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Get Client Token RESPONSE: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("Create Client Application", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Identity.getMyIdentityData(accessToken)
      .then(identityData => {
        userUUID = identityData.user_uuid;
        const name = "Unit-Test";
        const description = "Unit Test Application";
        // logger.info(identityData);
        s2sMS.Oauth.createClientApp(accessToken, userUUID, name, description)
          .then(response => {
            // logger.info(
            //   `Create Client Application RESPONSE: ${JSON.stringify(response, null, "\t")}`
            // );
            assert(
              response.hasOwnProperty("uuid") &&
                response.hasOwnProperty("name") &&
                response.name === "Unit-Test" &&
                response.hasOwnProperty("public_id") &&
                response.hasOwnProperty("secret") &&
                response.hasOwnProperty("application_type") &&
                response.application_type === "connect"
            );
            publicID = response.public_id;
            secret = response.secret;
            clientUUID = response.uuid;
            done();
          })
          .catch(error => {
            // logger.error(
            //   `Create Client Application ERROR: ${JSON.stringify(error, null, "\t")}`
            // );
            done(new Error(error));
          });
      })
      .catch(error => {
        done(new Error(error));
      });
  });

  it("Scope Client App", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.scopeClientApp(accessToken, clientUUID)
      .then(response => {
        // logger.info(
        //   `Scope Client App RESPONSE: ${JSON.stringify(response, null, "\t")}`
        // );
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Scope Client App  ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
    
  });

  it("Generate Basic Token", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.generateBasicToken(publicID, secret)
      .then(response => {
        // logger.info(
        //   `Generate Basic Token RESPONSE: ${JSON.stringify(
        //     response,
        //     null,
        //     "\t"
        //   )}`
        // );
        assert(
          Buffer.from(response, "base64").toString() === `${publicID}:${secret}`
        );
        clientBasicToken = response;
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Generate Basic Tokent RESPONSE: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("Get Client Access Token and Test It", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.getClientToken(clientBasicToken)
      .then(response => {
        // logger.info(
        //   `Get Client Access Token RESPONSE: ${JSON.stringify(response, null, "\t")}`);
        assert(
          response.hasOwnProperty("access_token") &&
            response.hasOwnProperty("token_type") &&
            response.token_type === "bearer"
        );
        clientAccessToken = response.access_token;
        s2sMS.Lambda.listLambdas(clientAccessToken)
          .then(identity => {
            // logger.info(
            //   `Test Client Access Token RESPONSE: ${JSON.stringify(identity, null, "\t")}`
            // );
            //no assert here just checking we received a resolved promise
            done();
          })
          .catch(identError => {
            // logger.error(
            //   `Test Client Access Token ERROR: ${JSON.stringify(identError, null, "\t")}`
            // );
            done(new Error(identError));
          });
      })
      .catch(error => {
        // logger.error(
        //   `Get Client Access Token ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("List Access Tokens", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.listClientTokens(
      accessToken,
      0, //offest
      10, //limit
      {
        token_type: "client",
        user_name: creds.email
      }
    )
      .then(response => {
        // logger.info(
        //   `List Access Tokens RESPONSE: ${JSON.stringify(response, null, "\t")}`
        // );
        assert(
          response.hasOwnProperty("items") &&
            response.items.length > 0 &&
            response.items[0].hasOwnProperty("access_token")
        );
        done();
      })
      .catch(error => {
        // logger.error(
        //   `List Access Tokens ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("Validate Access Token", function(done) {
    if (!creds.isValid) return done();
    logger.info(clientAccessToken);

    s2sMS.Oauth.validateToken(accessToken, clientAccessToken)
      .then(response => {
        // logger.info(
        //   `Validate Access Token RESPONSE: ${JSON.stringify(response, null, "\t")}`
        // );
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Validate Access Token ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("Invalidate Access Token", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.invalidateToken(accessToken, clientAccessToken)
      .then(response => {
        // logger.info(
        //   `Invalidate Access Token RESPONSE: ${JSON.stringify(response, null, "\t")}`
        // );
        assert(response.status === "ok");
        done();
      })
      .catch(error => {
        // logger.error(
        //   `Invalidate Access Token ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });

  it("List Access Tokens after Invalidation", function(done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.listClientTokens(
      accessToken,
      0, //offest
      10, //limit
      {
        token_type: "client",
        user_name: creds.email
      }
    )
      .then(response => {
        // logger.info(
        //   `List Access Tokens after Invalidation RESPONSE: ${JSON.stringify(response, null, "\t")}`
        // );
        // assert(
        //   response.hasOwnProperty("items") &&
        //   response.items.length > 0 &&
        //   response.items[0].hasOwnProperty("access_token")
        // );
        done();
      })
      .catch(error => {
        // logger.error(
        //   `List Access Tokens after Invalidation ERROR: ${JSON.stringify(error, null, "\t")}`
        // );
        done(new Error(error));
      });
  });
});
