const assert = require("assert");
const s2sMS = require("../src/index");
const fs = require("fs");

let creds = {
  CPAAS_OAUTH_KEY: "your oauth key here",
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
    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return new Promise((resolve, reject)=>{
      s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
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
    })
  });

  it("list shorturls", function (done) {
    if (!creds.isValid) return done();
    s2sMS.ShortUrls.listShortUrls(
        identityData.uuid,
        accessToken
      ).then(responseData => {
        console.log(responseData)
        assert(responseData.metadata !== null);
        done();
      })
      .catch((error) => {
        console.log('Error getting shortUrl list', error);
        done(new Error(error));
      });
  });

  it("create / delete ", function (done) {
    if (!creds.isValid) return done();

    const options = {
      url: "http://www.google.com"
    };
    s2sMS.ShortUrls.createShortUrl(
      identityData.uuid,
      accessToken,
      options
    ).then(responseData => {
      console.log(responseData);
      assert(responseData.short_code.length > 0);
      s2sMS.ShortUrls.deleteShortCode(
        identityData.uuid,
        accessToken,
        responseData.short_code
      );
      done();
    })
    .catch((error) => {
      console.log('Error creating shortUrl ', error);
      done(error);
    });
  });
});