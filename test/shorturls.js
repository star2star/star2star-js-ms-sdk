const assert = require("assert");
const s2sMS = require("../index");
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

  let accessToken;

  before(function () {
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");
    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }

    // get accessToken to use in test cases
    // Return promise so that test cases will not fire until it resolves.
    return s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.CPAAS_API_VERSION,
        creds.email,
        creds.password
      )
      .then(oauthData => {
        const oData = JSON.parse(oauthData);
        // console.log('Got access token and identity data -[Get Object By Data Type] ', identityData, oData);
        accessToken = oData.access_token;
      });
  });

  it("list shorturls", function (done) {
    if (!creds.isValid) return done();

    s2sMS.Identity.getMyIdentityData(accessToken)
      .then((identityData) => {
        const idData = JSON.parse(identityData);
        s2sMS.ShortUrls.listShortUrls(
            idData.user_uuid,
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
      })
      .catch((error) => {
        console.log('Error getting identity data [get shorturl list]', error);
        done(new Error(error));
      })
  });

  it("create / delete ", function (done) {
    if (!creds.isValid) return done();

    const options = {
      url: "http://www.google.com"
    };
    s2sMS.ShortUrls.create(
      user_uuid,
      accessToken,
      options
    ).then(responseData => {
      // console.log(responseData);
      assert(responseData.short_code.length > 0);
      s2sMS.ShortUrls.deleteShortCode(

        user_uuid,
        accessToken,
        responseData.short_code
      );
      done();
    });
  });
});