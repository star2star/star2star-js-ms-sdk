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

describe("ShortUrls Test Suite", function () {

  let accessToken, identityData;

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
              identityData = identityDetails;
              resolve();
            }).catch((e1)=>{
              reject(e1);
            });
          }).catch((e)=>{
            reject(e);
          });
        });
    });
  });

  it("create / list / delete ", function (done) {
    if (!creds.isValid) return done();
    
    const options = {
      url: "http://www.google.com"
    };
    s2sMS.ShortUrls.createShortUrl(
      accessToken,
      options
    ).then(response => {
      //console.log('------->', response);
      assert(response.hasOwnProperty("short_url_link"));
      s2sMS.ShortUrls.listShortUrls(
        identityData.uuid,
        accessToken
      ).then(response => {
        //console.log('List of ShortUrls', response);
        //TODO issue CSRVS-77 content rename to items 
        assert(response.hasOwnProperty("content") && response.content.length > 0);
        setTimeout(()=>{
          s2sMS.ShortUrls.deleteShortCode(
            identityData.uuid,
            accessToken,
            response.content[0].short_code
          ).then(response => {
            //console.log(response);
            assert(response.status === "ok");
            done();
          }).catch(error=>{
            console.log("Error Deleting ShortUrl", error);
            done(new Error(error));
          });
        }, 1000);
      })
        .catch((error) => {
          console.log("Error listing shortUrls", error);
          done(new Error(error));
        });
    })
      .catch((error) => {
        console.log("Error creating shortUrl ", error);
        done(new Error(error));
      });
  });
});