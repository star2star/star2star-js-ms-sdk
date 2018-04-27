var assert = require("assert");
var s2sMS = require("../index");
var fs = require("fs");


var creds = {
  CPAAS_KEY: "yourkeyhere",
  CPAAS_IDENTITY_KEY: "id key here",
  CPAAS_OAUTH_KEY: "your oauth key here",
  CPAAS_OAUTH_TOKEN: "Basic your oauth token here",
  CPAAS_API_VERSION: "v1",
  email: "email@email.com",
  password: "pwd",
  isValid: false
};

describe("Oauth MS", function () {

  before(function () {
    // For tests, use the dev msHost
    s2sMS.setMsHost("https://cpaas.star2starglobal.net");

    // file system uses full path so will do it like this
    if (fs.existsSync("./test/credentials.json")) {
      // do not need test folder here
      creds = require("./credentials.json");
    }
  });

  it("Get Access Token", function (done) {
    if (!creds.isValid) return done();
    s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.CPAAS_API_VERSION,
        creds.email,
        creds.password
      )
      .then(oauthData => {
        const oData = JSON.parse(oauthData);
        // console.log('Got access token data ', oData);
        assert(
          oData.hasOwnProperty('access_token') &&
          oData.hasOwnProperty('refresh_token') &&
          oData.hasOwnProperty('expires_in')
        );
        done();
      })
      .catch((e) => {
        console.log(e)
      });
  });

  it("Refresh Token", function (done) {
    if (!creds.isValid) return done();
    // get access token
    s2sMS.Oauth.getAccessToken(
        creds.CPAAS_OAUTH_KEY,
        creds.CPAAS_OAUTH_TOKEN,
        creds.CPAAS_API_VERSION,
        creds.email,
        creds.password
      )
      .then(oauthData => {
        const oData = JSON.parse(oauthData);
        // Use new refresh token to test refreshAccessToken()
        s2sMS.Oauth.refreshAccessToken(creds.CPAAS_OAUTH_KEY,
            creds.CPAAS_OAUTH_TOKEN,
            creds.CPAAS_API_VERSION,
            oData.refresh_token
          )
          .then(refreshData => {
            const rData = JSON.parse(refreshData);
            // console.log('refresh data', rData);
            assert(
              rData.hasOwnProperty('access_token') &&
              rData.hasOwnProperty('refresh_token') &&
              rData.hasOwnProperty('expires_in')
            );
            done();
          })
          .catch((e) => {
            console.log('Error refreshing token', e);
          });

      }).catch((e) => {
        console.log('Failed to get access token in refresh token test', e);
      })
  });
});